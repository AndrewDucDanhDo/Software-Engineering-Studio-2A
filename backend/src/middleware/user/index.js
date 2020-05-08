// Make sure that the authId matches the userId that is
// being fetched via the userId path param
export const checkUser = (req, res, next) => {
  // This is made available via the firebase checkToken middleware
  const { authId } = req;
  const userId = req.params.userId;

  if (authId == userId) {
    return next();
  } else {
    return handleApiError(res, new AuthenticationError());
  }
};
