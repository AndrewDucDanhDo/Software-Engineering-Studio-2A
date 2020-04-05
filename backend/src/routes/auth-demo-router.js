import { Router } from "express";
import { checkIfAuthenticated } from "../middleware/firebase-auth";

const authDemoRouter = Router();

authDemoRouter.get("/secure", checkIfAuthenticated, (req, res) => {
  res.send("This path is secure");
});

authDemoRouter.get("/public", (req, res) => {
  res.send("This path is public to everyone");
});

export default authDemoRouter;
