import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
	return (
		<div style={{ backgroundColor: "salmon", padding: "10px" }}>
			<Link to="/">
				<p>Home</p>
			</Link>
			<Link to="/signup">
				<p>Sign Up</p>
			</Link>
			<Link to="/login">
				<p>Login</p>
			</Link>
			<Link to="/profile">
				<p>Profile</p>
			</Link>
		</div>
	);
}

export default Navigation;
