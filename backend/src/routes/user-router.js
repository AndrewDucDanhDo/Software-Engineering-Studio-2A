import { Router } from "express";
import { createUser, getUser } from "../controllers/user";
import { checkIfAuthenticated } from "../middleware/firebase-auth";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get("/:userId", checkIfAuthenticated, getUser);

export default userRouter;
