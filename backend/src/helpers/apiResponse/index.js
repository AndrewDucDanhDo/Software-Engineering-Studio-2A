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
