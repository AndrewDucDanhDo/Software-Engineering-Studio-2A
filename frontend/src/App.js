import React from "react";
import "./styles/App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import QuantumSimulator from "./components/quantum";
import Header from "./components/header";
import Footer from "./components/footer";

// Components
import Navigation from "./components/navigation";

// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<div>
					<Navigation />
					<Switch>
						<Route path="/signup">
							<SignupPage />
						</Route>
						<Route path="/login">
							<LoginPage />
						</Route>
            <Route path="/">
							<HomePage />
						</Route>
					</Switch>
				</div>
			</BrowserRouter>
			<Header />
			<QuantumSimulator />
			<Footer />
		</div>
	);
}

export default App;
