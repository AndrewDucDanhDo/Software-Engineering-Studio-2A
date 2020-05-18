import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { stripRoles } from "../middleware/roles";
import { getSingleTask, getAllTasks } from "../controllers/task";
import { createSubmission } from "../controllers/submission";

const taskStudentRouter = Router();

// Stripping the roles here to make sure that all users regardless of role receive
// the same formatted response back since they use a shared controller function
taskStudentRouter.get("/", checkToken, stripRoles, getAllTasks);
taskStudentRouter.get("/:taskId", checkToken, stripRoles, getSingleTask);
taskStudentRouter.post("/:taskId/submit", checkToken, createSubmission);

export default taskStudentRouter;
