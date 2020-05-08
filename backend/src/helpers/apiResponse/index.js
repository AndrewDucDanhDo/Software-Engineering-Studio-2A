import { ParamValidationError } from "../validators/params";
import { CircuitDataSyntaxError } from "../validators/circuitData";
import { AuthenticationError } from "../../middleware/firebase-auth/index";

export const successResponse = (data) => {
  return {
    status: "OK",
    data: data
  };
};

export const errorResponse = (msg, errorCode, error) => {
  return {
    status: "ERROR",
    msg: msg,
    errorCode: errorCode !== undefined ? errorCode : "unknown",
    error: error !== undefined ? error.toString() : undefined
  };
};

// Pass an express response object to this function and it will return
// an appropriate api error for the error type defaulting to a standard
// error unknown if the error cannot be matched
export const handleApiError = (res, error) => {
  switch (error.constructor) {
    case ParamValidationError:
      if (error.failureCode === "undefined") {
        return res
          .status(400)
          .json(
            errorResponse(
              `Param '${error.failedParam}' must be present in the request.`,
              "missing-param",
              undefined
            )
          );
      } else if (error.failureCode === "type") {
        return res
          .status(400)
          .json(
            errorResponse(
              `Param '${error.failedParam}' must be of type ${error.expectedType}.`,
              "param-type",
              undefined
            )
          );
      }
    case CircuitDataSyntaxError:
      return res
        .status(400)
        .json(
          errorResponse(
            `Key '${error.missingKey}' is required in the circuit object.`,
            "missing-circuit-key",
            undefined
          )
        );
    case AuthenticationError:
      return res
        .status(401)
        .json(
          errorResponse(
            "You are not authorized to make this request",
            "auth-key"
          )
        );
    default:
      // Throw a generic error response for unknown errors
      return res
        .status(500)
        .json(
          errorResponse(
            "An unknown error occurred.",
            undefined,
            error
          )
        );
  }
};
