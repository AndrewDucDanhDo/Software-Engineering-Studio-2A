import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/user";
import { checkToken } from "../middleware/firebase-auth";
import { checkUser } from "../middleware/restrictions";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get("/:userId", checkToken, checkUser, getUser);
userRouter.post("/:userId/update", checkToken, checkUser, updateUser);
userRouter.delete("/:userId/update", checkToken, checkUser, deleteUser);

export default userRouter;
