import { db } from "../helpers/firebase-admin";
import { handleApiError, successResponse } from "../helpers/apiResponse";
import { checkParams } from "../helpers/validators/params";
import { checkTaskData } from "../helpers/validators/taskData";
import { FirestoreError } from "../errors/firestore";
import { v4 as uuidv4 } from "uuid";

const formatTaskForStudent = (taskData) => {
  return {
    taskId: taskData.taskID,
    name: taskData.name,
    summary: taskData.summary,
    description: taskData.description,
    expectedResults: taskData.expectedResults
  };
};

const hasTeacherRole = (req) => {
  return req.userClaims !== undefined && req.userClaims.teacher === true;
};

const isUserAssignedToTask = (userId, taskData) => {
  return taskData.assigned !== undefined && taskData.assigned.includes(userId);
};

export const createTask = async (req, res) => {
  try {
    const taskBody = req.body;
    const userId = req.authId;

    // Generate a new uuid if no id was provided
    if (taskBody.taskId === undefined) {
      taskBody.taskId = uuidv4();
    }

    checkParams({
      taskBody: {
        data: taskBody,
        expectedType: "object"
      }
    });

    checkTaskData(taskBody);

    // Set the current user as the admin of this task so they cannot be deleted from it
    taskBody.admin = userId;

    const taskDoc = await db.collection("tasks").doc(taskBody.taskId).get();

    if (taskDoc.exists === false) {
      await taskDoc.ref.set(taskBody);
      return res.status(200).json(
        successResponse({
          msg: "Task created successfully",
          taskId: taskBody.taskId
        })
      );
    } else {
      throw new FirestoreError("exists", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const userId = req.authId;

    // Format data based on the type of the user thats signed in, admins
    // receive all tasks and other users only the tasks they're assigned
    let taskList;
    if (hasTeacherRole(req)) {
      const tasksCollection = await db.collection("tasks").get();
      taskList = tasksCollection.docs.map((doc) => {
        return { ...doc.data(), taskId: doc.id };
      });
    } else {
      // Only return tasks that are assigned to the requesting user
      const assignedTasksQuery = await db
        .collection("tasks")
        .where("assigned", "array-contains", userId)
        .get();

      // Fetch all submissions
      const allSubmissions = await db.collectionGroup("submissions").get();
      // Filter only requesting users submissions and create a map of the users
      // submissions with the key for each submission being the task id it was
      // submitted to by the user
      const usersSubmissions = allSubmissions.docs
        .filter((doc) => doc.id === userId)
        .reduce((result, doc, index, array) => {
          const taskId = doc.ref.parent.parent.id;
          result[taskId] = doc.data();
          return result;
        }, {});

      taskList = assignedTasksQuery.docs.map((doc) => {
        // These variables are used in the frontend to
        // make displaying things easier in task lists
        const submissionReceived = usersSubmissions[doc.id] !== undefined;
        const submissionEvaluated =
          submissionReceived &&
          usersSubmissions[doc.id].results.status.length > 0;

        return {
          ...formatTaskForStudent(doc.data()),
          taskId: doc.id,
          submissionReceived,
          submissionEvaluated
        };
      });
    }
    return res.status(200).json(successResponse(taskList));
  } catch (error) {
    handleApiError(res, error);
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.authId;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    const taskDoc = await db.collection("tasks").doc(taskId).get();

    if (taskDoc.exists === true) {
      const taskDocData = taskDoc.data();
      let formattedTaskData;

      // Format task data based on the users role
      if (hasTeacherRole(req)) {
        formattedTaskData = taskDocData;
      } else {
        // Only return task data if the user is assigned to the task
        if (isUserAssignedToTask(userId, taskDocData)) {
          formattedTaskData = formatTaskForStudent(taskDocData);
        } else {
          throw new FirestoreError("auth", taskDoc.ref, "task");
        }
      }

      return res.status(200).json(successResponse(formattedTaskData));
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskBody = req.body;
    const taskId = req.params.taskId;
    const userId = req.authId;

    // We do not want to update the taskId in firestore after it is set
    // so just replace the taskBody taskId with the one from params
    taskBody.taskId = taskId;

    checkParams({
      taskBody: {
        data: taskBody,
        expectedType: "object"
      },
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    checkTaskData(taskBody);

    const taskDoc = await db.collection("tasks").doc(taskId).get();

    if (taskDoc.exists === true) {
      // Check that the user requesting to update the tasks is an owner of the task
      if (
        taskDoc.data().owners.includes(userId) === true ||
        taskDoc.data().admin === userId
      ) {
        await taskDoc.ref.set({ admin: taskDoc.data().admin, ...taskBody });
        return res
          .status(200)
          .json(
            successResponse({ msg: "Task was successfully updated", taskId })
          );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.authId;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    const taskDoc = await db.collection("tasks").doc(taskId).get();

    if (taskDoc.exists === true) {
      // Check that the user requesting to delete the tasks is an owner of the task
      if (
        taskDoc.data().owners.includes(userId) ||
        taskDoc.data().admin === userId
      ) {
        await taskDoc.ref.delete();
        return res
          .status(200)
          .json(successResponse({ msg: "Task was successfully deleted." }));
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};
