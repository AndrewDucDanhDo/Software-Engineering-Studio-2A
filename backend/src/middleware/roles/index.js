import { handleApiError } from "../../helpers/apiResponse";
import { AuthenticationError } from "../../errors/auth";

// Check the token is teacher role
export const checkTeacherRole = (req, res, next) => {
  const { teacher, superuser } = req.userClaims;

  if (teacher === true || superuser === true) {
    return next();
  }
  return handleApiError(res, new AuthenticationError());
};

// Check the token is super user role
export const checkSuperUserRole = (req, res, next) => {
  const { teacher, superuser } = req.userClaims;

  if (superuser === true) {
    return next();
  }
  return handleApiError(res, new AuthenticationError());
};

// Remove all userClaims on the request to effectively
// demote the user for the single request made
export const stripRoles = (req, res, next) => {
  delete req.userClaims
  next()
}
