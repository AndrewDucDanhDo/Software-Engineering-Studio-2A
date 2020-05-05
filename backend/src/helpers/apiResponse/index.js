// TODO make these all accept an response object and return a formatted response to the caller

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
