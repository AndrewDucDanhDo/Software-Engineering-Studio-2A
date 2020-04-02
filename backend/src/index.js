import express from "express";
const morgan = require("morgan");
import greeterRouter from "./routes/greeter-router";

const app = express();
const config = {
	port: process.env.API_PORT,
	stage: process.env.STAGE
};

// Middleware
app.use(morgan("tiny"));

// Routes
app.use("/greeter", greeterRouter);

app.get("/", (req, res) => {
	res.json({
		stage: config.stage,
		msg: "Hello from the API"
	});
});

app.listen(config.port, () => {
	console.log(`Server is now running at:  http://localhost:${config.port}`);
});
