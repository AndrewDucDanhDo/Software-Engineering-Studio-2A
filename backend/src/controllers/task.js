import { db } from "../helpers/firebase-admin";
import { handleApiError, successResponse } from "../helpers/apiResponse";
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

      // Cleanup data based on the role that called for the task

      return res.status(200).json(successResponse(taskDoc.data()));
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

// export const updateTask = async (req, res) => {
//   try {
//     const taskBody = req.body;
//     const taskId = taskBody.id;

//     checkParams({
//       taskBody: {
//         data: taskBody,
//         expectedType: "object"
//       },
//       taskId: {
//         data: taskId,
//         expectedType: "string"
//       }
//     });

//     checkTaskData(taskBody);

//     const taskDoc = await db.collection("tasks").doc(taskId).get();

//     if (taskDoc.exists === true) {
//       await taskDoc.ref.set(taskBody);
//       return res
//         .status(200)
//         .json(
//           successResponse({ msg: "Task was successfully updated", taskId })
//         );
//     } else {
//       throw new FirestoreError("missing", taskDoc.ref, "task");
//     }
//   } catch (error) {
//     handleApiError(res, error);
//   }
// };

// export const deleteTask = async (req, res) => {
//   try {
//     const taskId = req.params.taskId;

//     checkParams({
//       taskId: {
//         data: taskId,
//         expectedType: "string"
//       }
//     });

//     const taskData = await db.collection("tasks").doc(taskId).get();

//     if (taskData.exists === true) {
//       await taskData.ref.delete();
//       return res
//         .status(200)
//         .json(successResponse({ msg: "Task was successfully deleted." }));
//     } else {
//       throw new FirestoreError("missing", taskDoc.ref, "task");
//     }
//   } catch (error) {
//     handleApiError(res, error);
//   }
// };
