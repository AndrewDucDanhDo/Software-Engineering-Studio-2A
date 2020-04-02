export function returnHello(req, res) {
	res.json({
		msg: "HELLO!"
	});
}

export function returnWorld(req, res) {
	res.json({
		msg: "WORLD!"
	});
}
