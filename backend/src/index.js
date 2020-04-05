import express from "express";
import bodyParser from "body-parser";
import circuitRouter from "./routes/circuit-router";
const morgan = require("morgan");

const app = express();
const config = {
  port: process.env.API_PORT,
  stage: process.env.STAGE
};

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/circuit", circuitRouter);

// Any top level endpoints
app.get("/", (req, res) => {
  res.json({
    stage: config.stage,
    msg: "Hello from quantum simulator API 🛰!"
  });
});

app.listen(config.port, () => {
  console.log(`Server is now running at:  http://localhost:${config.port}`);
});
