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

const userAdminRouter = Router().use(checkToken, checkTeacherRole);

userAdminRouter.get("/", getAllUsers);
userAdminRouter.get("/:userId", getUser);
userAdminRouter.get("/:userId/roles", getUserRoles);
userAdminRouter.post("/:userId/roles/update", updateUserRoles);
userAdminRouter.delete("/:userId/update", deleteUser);

export default userAdminRouter;
