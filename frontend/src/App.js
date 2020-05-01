import React from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles"
// Components
import Navigation from "./components/navigation";
// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import appTheme from "./helpers/appTheme";

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={appTheme}>
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
							<Route path="/profile">
								<ProfilePage />
							</Route>
							<Route path="/">
								<HomePage />
							</Route>
						</Switch>
					</div>
				</BrowserRouter>
			</ThemeProvider>
		</div>
	);
}

export default App;
