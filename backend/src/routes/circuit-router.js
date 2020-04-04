import { Router } from "express";
import * as circuitController from "../controllers/circuit";

const circuitRouter = Router();

/**
 * @swagger
 *
 *  /circuit/solver:
 *    post:
 *      summary: Solves a quantum circuit
 *      description: Will solve the quantum circuit json and supply the solutions
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: circuit
 *          type: object
 *        - name  state
 *      responses:
 *        '400':
 *          description: Solution found for circuit
 */

circuitRouter.post("/solve", circuitController.solve);

export default circuitRouter;
