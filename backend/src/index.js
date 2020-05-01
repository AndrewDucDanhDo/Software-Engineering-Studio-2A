import express from "express";
import bodyParser from "body-parser";
import circuitRouter from "./routes/circuit-router";
import userRouter from "./routes/user-router";
import authRouter from "./routes/auth-router";
import cors from "cors";
import env from "./helpers/env";
const morgan = require("morgan");

const app = express();
const config = {
  port: env.port,
  stage: env.stage
};

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/circuit", circuitRouter);

// Default route
app.get("/", (req, res) => {
  res.json({
    stage: config.stage,
    msg: "Hello from quantum simulator API 🛰!"
  });
});

// Startup complete
const server = app.listen(config.port, () => {
  console.log(`Server is now running at:  http://localhost:${config.port}`);
});

module.exports = server;
