import { Router } from "express";
import { login } from "../controllers/auth";

const circuitRouter = Router();

circuitRouter.post("/login", login);

export default circuitRouter;
