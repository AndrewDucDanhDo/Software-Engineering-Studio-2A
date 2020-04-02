import express from "express";

const app = express();
const config = {
	port: process.env.API_PORT,
	stage: process.env.STAGE
};

// Middleware

// Routes

app.get("/", (req, res) => {
	res.json({
		stage: config.stage,
		msg: "Hello from the API"
	});
});

app.listen(port, () => {
	console.log(`http://localhost:${config.port}`);
});
