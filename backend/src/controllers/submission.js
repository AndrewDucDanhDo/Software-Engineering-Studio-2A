import { checkParams } from "../helpers/validators/params";
import { checkCircuitData } from "../helpers/validators/circuitData";
import { handleApiError, successResponse } from "../helpers/apiResponse";
import { FirestoreError } from "../errors/firestore";
import firestore from "../helpers/firestore";
import { checkSubmissionResultsData } from "../helpers/validators/submissionResultsData";
import { markSubmission, allSolutions, compareSubmission } from "../helpers/quantom-simulator/marker";

const userCanSubmit = (taskData, userId) => {
  return taskData.assigned.includes(userId);
};

const teacherCanUpdate = (taskData, teacherId) => {
  return taskData.owners.includes(teacherId);
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
          // if there is no existing submission, send blank circuit and results
          return res.status(200).json(
            successResponse({
              circuit: {
                "gates": [], "circuit": [], "qubits": 2, "input": [0, 0]
              },
              results: {
                submissionMark: 0, totalMarks: 100, status: "", assessor: "", comment: ""
              }
            })
          );
        }
      }
    } else {
      throw new FirestoreError("missing", taskDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

// getUserSubmission
export const getUserSubmission  = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const teacherId = req.authId;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      },
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check the submission doc exists
    if (submissionDoc.exists) {
      // Check the teacher is one of the owners of the task
      if (teacherCanUpdate(taskDoc.data(), teacherId)) {

        return res.status(200).json(
          successResponse({
            owner: userId,
            ...submissionDoc.data()
          })
        );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "task");
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
    const submissionResultsBody = req.body;
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const teacherId = req.authId;

    checkParams({
      submissionResultsBody: {
        data: submissionResultsBody,
        expectedType: "object"
      },
      taskId: {
        data: taskId,
        expectedType: "string"
      },
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    checkSubmissionResultsData(submissionResultsBody);

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check the submission doc we want to update exists
    if (submissionDoc.exists) {
      // Check the teacher is one of the owners of the task and can update results
      if (teacherCanUpdate(taskDoc.data(), teacherId)) {
        await firestore.submission.updateSubmissionResults(
          submissionDoc,
          submissionResultsBody
        );

        return res.status(200).json(
          successResponse({
            msg: `Submission results successfully updated for ${userId}`
          })
        );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const markUserSubmission = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const teacherId = req.authId;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      },
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check the submission doc we want to update exists
    if (submissionDoc.exists) {
      // Check the teacher is one of the owners of the task
      if (teacherCanUpdate(taskDoc.data(), teacherId)) {

        // Find the output for the master circuit, these will be our solutions
        const masterCircuit = taskDoc.data().masterCircuit;
        const studentCircuit = submissionDoc.data().circuit;

        // Find the students output, compute these against the solutions to get the score.
        const solutions = await allSolutions(masterCircuit);
        const score = await markSubmission(solutions, masterCircuit.qubits, studentCircuit);

        // Save to firebase
        const submissionResultsBody = {
          submissionMark: score * 100,
          totalMarks: 100,
          status: score >= 0.5 ? "PASS" : "FAIL",
          assessor: teacherId,
          comment: "AUTOMATED MARKING"
        }
        await firestore.submission.updateSubmissionResults(
          submissionDoc,
          submissionResultsBody
        );

        return res.status(200).json(
          successResponse({
            msg: `Student ${userId} circuit submission successfully marked for task ${taskId}`,
            owner: submissionDoc.data().id,
            results: submissionResultsBody
          })
        );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const runUserSubmission = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const teacherId = req.authId;

    checkParams({
      taskId: {
        data: taskId,
        expectedType: "string"
      },
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    const taskDoc = await firestore.task.get(taskId);
    const submissionDoc = await firestore.submission.get(taskId, userId);

    // Check the submission doc we want to update exists
    if (submissionDoc.exists) {
      // Check the teacher is one of the owners of the task
      if (teacherCanUpdate(taskDoc.data(), teacherId)) {

        // Find the output for the master circuit, these will be our solutions
        const masterCircuit = taskDoc.data().masterCircuit;
        const studentCircuit = submissionDoc.data().circuit;

        // Find the students output, compute these against the solutions to get the score.
        const solutions = await allSolutions(masterCircuit);
        const results = await compareSubmission(solutions, masterCircuit.qubits, studentCircuit);

        return res.status(200).json(
          successResponse({
            msg: `Student ${userId} circuit submission successfully marked for task ${taskId}`,
            owner: submissionDoc.data().id,
            results: results
          })
        );
      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

export const markTaskSubmissions = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const teacherId = req.authId;
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

        // Find the output for the master circuit, these will be our solutions
        const masterCircuit = taskDoc.data().masterCircuit;
        const solutions = await allSolutions(masterCircuit);

        // Get the scores for each submission
        const results = await Promise.all(taskSubmissionsCollection.docs.map(
          async (submission) => {
            // Get the percentage of correct outputs
            const score = await markSubmission(solutions, masterCircuit.qubits, submission.data().circuit);

            // Save to firebase
            const submissionResultsBody = {
              submissionMark: score * 100,
              totalMarks: 100,
              status: score >= 0.5 ? "PASS" : "FAIL",
              assessor: teacherId,
              comment: "AUTOMATED MARKING"
            }
            await firestore.submission.updateSubmissionResults(
              submission,
              submissionResultsBody
            );

            return {
              owner: submission.id,
              results: submissionResultsBody
            };
          }
        ));

        // TODO: Remove timeout
        setTimeout((function () {
          return res.status(200).json(
            successResponse({
              msg: `Circuit submission successfully marked for task ${taskId}`,
              results: results
            })
          );
        }), 2000);


      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};

// Function to help with demoing
// resets all the results for a task
// resetTaskResults
export const resetTaskResults = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const teacherId = req.authId;
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

        // Get the scores for each submission
        taskSubmissionsCollection.docs.forEach(
          async (submission) => {

            // Save to firebase
            const submissionResultsBody = {
              submissionMark: 0,
              totalMarks: 100,
              status: "",
              assessor: "",
              comment: ""
            }
            await firestore.submission.updateSubmissionResults(
              submission,
              submissionResultsBody
            );
          }
        );

        return res.status(200).json(
          successResponse({
            msg: `Results successfully reset for task ${taskId}`
          })
        );

      } else {
        throw new FirestoreError("auth", taskDoc.ref, "task");
      }
    } else {
      throw new FirestoreError("missing", submissionDoc.ref, "task");
    }
  } catch (error) {
    handleApiError(res, error);
  }
};