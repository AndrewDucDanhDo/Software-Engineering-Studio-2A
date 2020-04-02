import { Router } from "express";
import { returnHello, returnWorld } from "../controllers/greeter";

const greeterRouter = Router();

greeterRouter.get("/hello", returnHello);
greeterRouter.get("/world", returnWorld);

export default greeterRouter;
