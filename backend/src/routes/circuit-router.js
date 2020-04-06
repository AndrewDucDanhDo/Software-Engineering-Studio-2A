import { Router } from "express";
import * as circuitController from "../controllers/circuit";
// const Router = require("express");
// const circuitController = require("../controllers/circuit");

const circuitRouter = Router();

circuitRouter.post("/solve", circuitController.solve);

export default circuitRouter;
// module.exports = circuitRouter;
