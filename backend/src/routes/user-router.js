import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/user";
import { checkIfAuthenticated } from "../middleware/firebase-auth";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get("/:userId", checkIfAuthenticated, getUser);
userRouter.post("/:userId/update", checkIfAuthenticated, updateUser);
userRouter.delete("/:userId/update", checkIfAuthenticated, deleteUser);

export default userRouter;
