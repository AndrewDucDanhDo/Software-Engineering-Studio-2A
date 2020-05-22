import { db } from "../firebase-admin";

export const firestoreTask = {
  get: (taskId) => {
    return db.collection("tasks").doc(taskId).get();
  }
};
