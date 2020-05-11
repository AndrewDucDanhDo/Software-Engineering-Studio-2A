// Check the token is teacher role
export const checkTeacherRole = (req, res, next) => {
  const { teacher } = req.userClaims;

  if (teacher === true) {
    return next();
  }
  return handleApiError(res, new AuthenticationError());
};
