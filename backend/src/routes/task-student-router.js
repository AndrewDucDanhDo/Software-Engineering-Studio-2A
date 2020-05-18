import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { stripRoles } from "../middleware/roles";
import { getSingleTask, getAllTasks } from "../controllers/task";
import {
  createSubmission,
  getTaskSubmissions
} from "../controllers/submission";

const taskStudentRouter = Router().use(checkToken, stripRoles);

// Stripping the roles here to make sure that all users regardless of role receive
// the same formatted response back since they use a shared controller function
taskStudentRouter.get("/", getAllTasks);
taskStudentRouter.get("/:taskId", getSingleTask);
taskStudentRouter.post("/:taskId/submit", createSubmission);
taskStudentRouter.get("/:taskId/submission", getTaskSubmissions);

export default taskStudentRouter;
