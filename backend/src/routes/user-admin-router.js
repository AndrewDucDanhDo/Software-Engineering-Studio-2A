import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { checkTeacherRole } from "../middleware/roles";
import {
  getUser,
  getAllUsers,
  getUserRoles,
  updateUserRoles
} from "../controllers/user";
import { getTaskSubmissions, updateSubmissionResults } from "../controllers/submission";

const userAdminRouter = Router().use(checkToken, checkTeacherRole);

userAdminRouter.get("/", getAllUsers);
userAdminRouter.get("/:userId", getUser);
userAdminRouter.get("/:userId/roles", getUserRoles);
userAdminRouter.post("/:userId/roles/update", updateUserRoles);

export default userAdminRouter;
