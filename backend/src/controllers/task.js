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

export const createTask = async (req, res) => {
  try {
    const taskBody = req.body;

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

    // Make sure the owners block of the taskBody has the
    // authenticated users userId in it and if not add it
    const userId = req.authId;
    if (!taskBody.owners.includes(userId)) {
      taskBody.owners.push(userId);
    }

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

    // Format data based on the type of the user thats signed in
    // admins receive all tasks and other users only they're assigned
    let taskList;
    if (req.userClaims !== undefined && req.userClaims.teacher === true) {
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

      taskList = assignedTasksQuery.docs.map((doc) => {
        return { ...formatTaskForStudent(doc.data()), taskId: doc.id };
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
      if (req.userClaims !== undefined && req.userClaims.teacher === true) {
        formattedTaskData = taskDocData;
      } else {
        // TODO: We should also check if the user is assigned to this task as well
        formattedTaskData = formatTaskForStudent(taskDocData);
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
      await taskDoc.ref.set(taskBody);
      return res
        .status(200)
        .json(
          successResponse({ msg: "Task was successfully updated", taskId })
        );
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

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    const taskData = await db.collection("tasks").doc(taskId).get();

    if (taskData.exists === true) {
      await taskData.ref.delete();
      return res
        .status(200)
        .json(successResponse({ msg: "Task was successfully deleted." }));
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};
