import { Router } from "express";
import * as circuitController from "../controllers/circuit";

const circuitRouter = Router();

circuitRouter.post("/solve", circuitController.solve);

export default circuitRouter;
