import React from "react";
import "./styles/App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// Components
import Navigation from "./components/navigation";
import Footer from "./components/footer";
// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import appTheme from "./helpers/appTheme";
import TeacherTaskEditorPage from "./pages/teacherTaskEditor";
import TeacherTasksPage from "./pages/teacherTasks";
import TeacherTaskViewerPage from "./pages/teacherTaskViewer";
// Context
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import { CircuitProvider } from "./context/circuit";

function AppProvider(props) {
	return (
		<ThemeProvider theme={appTheme}>
			<AuthProvider>
				<CircuitProvider>
					{props.children}
				</CircuitProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}

function AppRouter(props) {
	return (
		<Switch>
			<PrivateRoute
				path="/teacherTasks"
				component={TeacherTasksPage}
				adminRoute={true}
			/>

			<PrivateRoute
				path="/teacherTaskViewer"
				component={TeacherTaskViewerPage}
				adminRoute={true}
			/>

			<PrivateRoute
				path="/teacherTaskEditor"
				component={TeacherTaskEditorPage}
				adminRoute={true}
			/>

			<PrivateRoute
				path="/profile"
				adminRoute={false}
				component={ProfilePage}
			/>

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
	);
}

function App() {
	return (
		<div className="App">
			<AppProvider>
				<BrowserRouter>
					<Navigation />
					<div>
						<AppRouter/>
						<Footer />
					</div>
				</BrowserRouter>
			</AppProvider>
		</div>
	);
}

export default App;
