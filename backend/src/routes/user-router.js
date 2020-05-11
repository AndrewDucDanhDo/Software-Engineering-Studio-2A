import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  makeUserTeacher
} from "../controllers/user";
import {
  saveUserCircuit,
  getUserCircuit,
  getAllUserCircuits,
  updateUserCircuit,
  deleteUserCircuit
} from "../controllers/circuit";
import { checkToken } from "../middleware/auth";
import { checkUser } from "../middleware/user";
import { checkTeacherRole } from "../middleware/roles";

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

// TODO Remove POC teacher role
userRouter.post("/:userId/promote", makeUserTeacher);
userRouter.post("/teacher",
  checkToken,
  checkTeacherRole,
  function (req, res) {
    res.status(200).json({
      status: "OK",
      data: { msg: "User has teacher auth." }
    })
  }
);


export default userRouter;
