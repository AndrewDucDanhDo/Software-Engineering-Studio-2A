import { checkParams } from "../helpers/validators/params";
import { checkCircuitData } from "../helpers/validators/circuitData";
import { handleApiError, successResponse } from "../helpers/apiResponse";
import { FirestoreError } from "../errors/firestore";
import firestore from "../helpers/firestore";

const userCanSubmit = (taskData, userId) => {
  return taskData.assigned.includes(userId);
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
