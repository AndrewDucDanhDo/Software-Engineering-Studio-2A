import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { checkTeacherRole, checkSuperUserRole } from "../middleware/roles";
import {
  getUser,
  getAllUsers,
  getUserRoles,
  updateUserRoles,
  deleteUser
} from "../controllers/user";
import { getTaskSubmissions, updateSubmissionResults } from "../controllers/submission";

const userAdminRouter = Router().use(checkToken, checkSuperUserRole);

userAdminRouter.get("/", getAllUsers);
userAdminRouter.get("/:userId", getUser);
userAdminRouter.get("/:userId/roles", getUserRoles);
userAdminRouter.post("/:userId/roles/update", updateUserRoles);
userAdminRouter.delete("/:userId/update", deleteUser);

export default userAdminRouter;
