import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { checkTeacherRole } from "../middleware/roles";
import {
  getSingleTask,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/task";

const taskAminRouter = Router();

taskAminRouter.post("/create", checkToken, checkTeacherRole, createTask);
taskAminRouter.get("/:taskId", checkToken, checkTeacherRole, getSingleTask);
taskAminRouter.post("/:taskId/update", checkToken, checkTeacherRole, updateTask);
taskAminRouter.delete("/:taskId/update", checkToken, checkTeacherRole, deleteTask);

export default taskAminRouter;
