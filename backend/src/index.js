import express from "express";
import bodyParser from "body-parser";
import circuitRouter from "./routes/circuit-router";
import userRouter from "./routes/user-router";
import authDemoRouter from "./routes/auth-demo-router";
import cors from "cors";
const morgan = require("morgan");

const app = express();
const config = {
  port: 4000,
  stage: process.env.STAGE
};

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/circuit", circuitRouter);
app.use("/user", userRouter);
app.use("/auth-demo", authDemoRouter);

app.get("/", (req, res) => {
  res.json({
    stage: config.stage,
    msg: "Hello from quantum simulator API 🛰!"
  });
});

const server = app.listen(config.port, () => {
  console.log(`Server is now running at:  http://localhost:${config.port}`);
});

module.exports = server
