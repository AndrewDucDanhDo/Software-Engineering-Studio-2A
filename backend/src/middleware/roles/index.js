// Check the token is teacher role
export const checkTeacherRole = (req, res, next) => {
  const { teacher } = req.userClaims;

  if (teacher === true) {
    return next();
  }
  return handleApiError(res, new AuthenticationError());
};

// Remove all userClaims on the request to effectively
// demote the user for the single made request
export const stripRoles = (req, res, next) => {
  delete req.userClaims
  next()
}
