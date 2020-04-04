import express from "express";
const morgan = require("morgan");
import bodyParser from "body-parser";
import greeterRouter from "./routes/greeter-router";
import circuitRouter from "./routes/circuit-router";

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
app.use("/greeter", greeterRouter);
app.use("/circuit", circuitRouter);

app.get("/", (req, res) => {
  res.json({
    stage: config.stage,
    msg: "Hello from quantum simulator API 🛰!"
  });
});

app.listen(config.port, () => {
  console.log(`Server is now running at:  http://localhost:${config.port}`);
});
