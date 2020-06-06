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
import {
  getTaskSubmissions,
  getUserSubmission,
  updateSubmissionResults,
  markTaskSubmissions,
  markUserSubmission,
  resetTaskResults
} from "../controllers/submission";

const taskAminRouter = Router().use(checkToken, checkTeacherRole);

taskAminRouter.get("/", getAllTasks);
taskAminRouter.post("/create", createTask);
taskAminRouter.get("/:taskId", getSingleTask);
taskAminRouter.post("/:taskId/update", updateTask);
taskAminRouter.delete("/:taskId/update", deleteTask);
taskAminRouter.get("/:taskId/submission", getTaskSubmissions);
taskAminRouter.get("/:taskId/submission/:userId", getUserSubmission);
taskAminRouter.post("/:taskId/submission/:userId/update", updateSubmissionResults);
taskAminRouter.post("/:taskId/mark", markTaskSubmissions);
taskAminRouter.post("/:taskId/mark/reset", resetTaskResults);
taskAminRouter.post("/:taskId/submission/:userId/mark", markUserSubmission);

export default taskAminRouter;
