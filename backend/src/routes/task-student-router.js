import { Router } from "express";
import { checkToken } from "../middleware/auth";
import { stripRoles } from "../middleware/roles";
import { getSingleTask } from "../controllers/task";

const taskStudentRouter = Router();

// Stripping the roles here to make sure that all users regardless of role
// receive the same formatted response back
taskStudentRouter.get("/:taskId", checkToken, stripRoles, getSingleTask);

export default taskStudentRouter;
