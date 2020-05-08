import { Router } from "express";
import { checkToken, checkTeacherRole } from "../middleware/firebase-auth";
import {
  getSingleTask,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/task";

const taskRouter = Router();

taskRouter.post("/create", checkToken, checkTeacherRole, createTask);
taskRouter.get("/:taskId", checkToken, checkTeacherRole, getSingleTask);
taskRouter.post("/:taskId/update", checkToken, checkTeacherRole, updateTask);
taskRouter.delete("/:taskId/update", checkToken, checkTeacherRole, deleteTask);

export default taskRouter;
