import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/user";
import {
  saveUserCircuit,
  getUserCircuit,
  getAllUserCircuits,
  updateUserCircuit,
  deleteUserCircuit
} from "../controllers/circuit";
import { checkToken } from "../middleware/firebase-auth";
import { checkUser } from "../middleware/restrictions";

const userRouter = Router();

// common user management endpoints
userRouter.post("/create", createUser);
userRouter.get("/:userId", checkToken, checkUser, getUser);
userRouter.post("/:userId/update", checkToken, checkUser, updateUser);
userRouter.delete("/:userId/update", checkToken, checkUser, deleteUser);

// user circuit management endpoints
userRouter.post("/circuit/create", checkToken, saveUserCircuit);
userRouter.get("/:userId/circuit", checkToken, checkUser, getAllUserCircuits);
userRouter.get(
  "/:userId/circuit/:circuitId",
  checkToken,
  checkUser,
  getUserCircuit
);
userRouter.post(
  "/:userId/circuit/:circuitId/update",
  checkToken,
  checkUser,
  updateUserCircuit
);
userRouter.delete(
  "/:userId/circuit/:circuitId/update",
  checkToken,
  checkUser,
  deleteUserCircuit
);

export default userRouter;
