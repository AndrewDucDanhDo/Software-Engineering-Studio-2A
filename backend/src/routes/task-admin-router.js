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
import { getTaskSubmissions, updateSubmissionResults } from "../controllers/submission";

const taskAminRouter = Router().use(checkToken, checkTeacherRole);

taskAminRouter.get("/", getAllTasks);
taskAminRouter.post("/create", createTask);
taskAminRouter.get("/:taskId", getSingleTask);
taskAminRouter.post("/:taskId/update", updateTask);
taskAminRouter.delete("/:taskId/update", deleteTask);
taskAminRouter.get("/:taskId/submission", getTaskSubmissions);
taskAminRouter.post("/:taskId/submission/:userId/update", updateSubmissionResults);

export default taskAminRouter;
