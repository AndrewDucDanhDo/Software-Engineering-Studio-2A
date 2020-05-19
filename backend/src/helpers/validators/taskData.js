import { MissingKeySyntaxError, KeyTypeSyntaxError } from "../../errors/syntax";

// Configuration for the task data validation
const requiredKeys = [
  { key: "taskId", type: "string" },
  { key: "name", type: "string" },
  { key: "summary", type: "string" },
  { key: "description", type: "string" },
  { key: "expectedResults", type: "array" },
  { key: "owners", type: "array" }
];

// TODO: Make this a super function that can be called by all the specific validators
// Call this function to check if a quantum circuit object is valid
// Required keys param is optional if the required keys need to be
// replaced with a different set of required keys
export const checkTaskData = (taskData) => {
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
