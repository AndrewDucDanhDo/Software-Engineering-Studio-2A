import React from "react";
import "./App.css";
import QuantumSimulator from "./components/quantum";
import Header from "./components/header";

function App() {
	return (
		<div className="App">
			<Header />
			<QuantumSimulator />
		</div>
	);
}

export default App;
