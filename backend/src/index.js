const express = require("express");
const app = express();
const port = process.env.API_PORT;
const stage = process.env.STAGE

app.get("/", (req, res) => {
	res.send(`Hello world from ${stage}!`);
});

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
