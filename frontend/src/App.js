import React from "react";
import "./App.css";
import QuantumSimulator from "./components/quantum";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
	return (
		<div className="App">
			<Header />
			<QuantumSimulator />
			<Footer />
		</div>
	);
}

export default App;
