import { db } from "../helpers/firebase-admin";
import { handleApiError, successResponse, errorResponse } from "../helpers/apiResponse";
import { checkParams } from "../helpers/validators/params";
import { checkTaskData } from "../helpers/validators/taskData";
import { FirestoreError } from "../errors/firestore";
import { v4 as uuidv4 } from "uuid";

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
    if (req.userClaims !== undefined && req.userClaims.teacher === true) {
      const tasksCollection = await db.collection("tasks").get();
      const tasksList = tasksCollection.docs.map((doc) => {
        return { taskId: doc.id, ...doc.data() };
      });
      return res.status(200).json(successResponse(tasksList));
    } else {
      // TODO: Implement a query to check for assigned tasks for a non teacher role request
      return res.status(500).json(errorResponse("not implemented yet"));
    }
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
        formattedTaskData = {
          taskId: taskDocData.taskID,
          name: taskDocData.name,
          summary: taskDocData.summary,
          description: taskDocData.description,
          expectedResults: taskDocData.expectedResults
        };
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
