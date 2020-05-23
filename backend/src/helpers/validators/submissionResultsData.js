import { MissingKeySyntaxError, KeyTypeSyntaxError } from "../../errors/syntax";

// Configuration for the task data validation
const requiredKeys = [
  { key: "totalMarks", type: "number" },
  { key: "assessor", type: "string" },
  { key: "status", type: "string" },
  { key: "comment", type: "string" },
  { key: "submissionMark", type: "number" }
];

// TODO: Make this a super function that can be called by all the specific validators
export const checkSubmissionResultsData = (taskData) => {
  requiredKeys.forEach((value) => {
    const expectedKey = value.key;
    const expectedType = value.type;
    const data = taskData[expectedKey];

    if (data === undefined) {
      throw new MissingKeySyntaxError("task", expectedKey);
    }

    if (typeof data !== expectedType) {
      // Workaround for there being no typeof data for arrays
      if (expectedType === "array") {
        if (Array.isArray(data) === false) {
          throw new KeyTypeSyntaxError("task", expectedKey, expectedType);
        }
      } else {
        throw new KeyTypeSyntaxError("task", expectedKey, expectedType);
      }
    }
  });
};
