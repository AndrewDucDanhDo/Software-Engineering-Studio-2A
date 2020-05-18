import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { checkTeacherRole } from "../middleware/roles";
import {
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks
} from "../controllers/task";
import { getTaskSubmissions } from "../controllers/submission"

const taskAminRouter = Router();

taskAminRouter.get("/", checkToken, checkTeacherRole, getAllTasks)
taskAminRouter.post("/create", checkToken, checkTeacherRole, createTask);
taskAminRouter.get("/:taskId", checkToken, checkTeacherRole, getSingleTask);
taskAminRouter.post("/:taskId/update", checkToken, checkTeacherRole, updateTask);
taskAminRouter.delete("/:taskId/update", checkToken, checkTeacherRole, deleteTask);
taskAminRouter.get("/:taskId/submission", checkToken, checkTeacherRole, getTaskSubmissions);

export default taskAminRouter;
