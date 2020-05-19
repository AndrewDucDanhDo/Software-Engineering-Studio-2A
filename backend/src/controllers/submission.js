import { checkParams } from "../helpers/validators/params";
import { checkCircuitData } from "../helpers/validators/circuitData";
import { handleApiError, successResponse } from "../helpers/apiResponse";
import { FirestoreError } from "../errors/firestore";
import firestore from "../helpers/firestore";

const userCanSubmit = (taskData, userId) => {
  return taskData.assigned.includes(userId);
};

const hasTeacherRole = (userClaims) => {
  return userClaims !== undefined && userClaims.teacher === true;
};

export const createSubmission = async (req, res) => {
  try {
    const submissionCircuitBody = req.body;
    const taskId = req.params.taskId;
    const userId = req.authId;

    checkParams({
      submissionCircuitBody: {
        data: submissionCircuitBody,
        expectedType: "object"
      },
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    checkCircuitData(submissionCircuitBody);

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check the task we are trying to submit to exists
    if (taskDoc.exists) {
      // Check the user has not made a submission yet
      if (!submissionDoc.exists) {
        // Check the user is assigned to the task and can make a submission
        if (userCanSubmit(taskDoc.data(), userId)) {
          // Create submission for user
          await firestore.submission.create(
            submissionDoc,
            submissionCircuitBody
          );
          return res
            .status(200)
            .json(successResponse({ msg: "Circuit submitted successfully." }));
        } else {
          throw new FirestoreError("auth", taskDoc.ref, "task");
        }
      } else {
        throw new FirestoreError("exists", submissionDoc.ref, "submission");
      }
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const getTaskSubmissions = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.authId;
    const userClaims = req.userClaims;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    const taskDoc = await firestore.task.get(taskId);
    const taskSubmissionsCollection = await firestore.submission.getAll(taskId);

    // Check the document exists
    if (taskDoc.exists) {
      // Check the user has a role of teacher and can access all submissions
      if (hasTeacherRole(userClaims)) {
        const formattedSubmissions = taskSubmissionsCollection.docs.map(
          (submission) => {
            return {
              owner: submission.id,
              ...submission.data()
            };
          }
        );

        return res.status(200).json(successResponse(formattedSubmissions));
      } else {
        const submissionDoc = await firestore.submission.get(taskId, userId);

        if (submissionDoc.exists) {
          return res.status(200).json(
            successResponse({
              owner: submissionDoc.id,
              ...submissionDoc.data()
            })
          );
        } else {
          throw new FirestoreError("missing", submissionDoc.ref, "submission");
        }
      }
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const submissionCircuitBody = req.body;
    const taskId = req.params.taskId;
    const userId = req.authId;

    checkParams({
      submissionCircuitBody: {
        data: submissionCircuitBody,
        expectedType: "object"
      },
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    checkCircuitData(submissionCircuitBody);

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check if the submission exists before updating
    if (submissionDoc.exists) {
      // Check the user is still assigned to the task to update the submission
      if (userCanSubmit(taskDoc.data(), userId)) {
        await firestore.submission.updateSubmissionCircuit(
          submissionDoc,
          submissionCircuitBody
        );

        return res
          .status(200)
          .json(
            successResponse({ msg: "Task submission successfully updated" })
          );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "submission");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.authId;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      }
    });

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check if the submission exists before deleting
    if (submissionDoc.exists) {
      // Check the user is still assigned to the task to update the submission
      if (userCanSubmit(taskDoc.data(), userId)) {
        await submissionDoc.ref.delete();
        return res
          .status(200)
          .json(
            successResponse({ msg: "Task submission successfully deleted" })
          );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "submission");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const updateSubmissionResults = async (req, res) => {
  try {
    res.status(500).json({ msg: "not implemented" });
  } catch (error) {
    handleApiError(res, error);
  }
};
