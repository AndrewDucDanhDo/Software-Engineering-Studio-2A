import { db } from "../firebase-admin";
import { v4 as uuid } from "uuid";

export const firestoreSubmission = {
  get: (taskId, userId) => {
    return db
      .collection("tasks")
      .doc(taskId)
      .collection("submissions")
      .doc(userId)
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
