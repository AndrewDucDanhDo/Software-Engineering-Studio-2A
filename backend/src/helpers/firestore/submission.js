import { db } from "../firebase-admin";
import { v4 as uuid } from "uuid";

const taskCollectionName = "tasks";
const submissionCollectionName = "submissions";

export const firestoreSubmission = {
  get: (taskId, userId) => {
    return db
      .collection(taskCollectionName)
      .doc(taskId)
      .collection(submissionCollectionName)
      .doc(userId)
      .get();
  },
  getAll: (taskId) => {
    return db
      .collection(taskCollectionName)
      .doc(taskId)
      .collection(submissionCollectionName)
      .get();
  },
  create: (submissionDoc, circuitData) => {
    const submissionData = {
      id: uuid(),
      circuit: circuitData,
      results: {
        submissionMark: 0,
        totalMarks: 100,
        status: "",
        assessor: "",
        comment: ""
      }
    };
    return submissionDoc.ref.set(submissionData);
  }
};
