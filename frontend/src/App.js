import React from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

// Components
import Navigation from "./components/navigation";
import Footer from "./components/footer";

// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import appTheme from "./helpers/appTheme";
import TasksPage from "./pages/teacher/Tasks";
import TeacherTaskEditorPage from "./pages/teacher/TaskEditor";
import AdminPage from "./pages/admin";
import CreateNewTaskPage from "./pages/teacher/CreateTask";

// Context
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import { CircuitProvider } from "./context/circuit";

function AppProvider(props) {
	return (
		<ThemeProvider theme={appTheme}>
			<AuthProvider>
				<CircuitProvider>{props.children}</CircuitProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}

function AppRouter(props) {
	return (
		<Switch>
			<PrivateRoute
				path="/admin/tasks"
				component={TasksPage}
				adminRoute={true}
			/>

			<PrivateRoute
				path="/admin/task/new-task"
				component={CreateNewTaskPage}
				adminRoute={true}
			/>

			<PrivateRoute
				path="/admin/task/:taskId"
				component={TeacherTaskEditorPage}
				adminRoute={true}
			/>

			<PrivateRoute
				path="/profile"
				adminRoute={false}
				component={ProfilePage}
			/>

			<PrivateRoute path="/admin" component={AdminPage} adminRoute={true} />

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
						<AppRouter />
						{/* TODO: Fix this so it actually goes to the bottom of the page */}
						{/* <Footer /> */}
					</div>
				</BrowserRouter>
			</AppProvider>
		</div>
	);
}

export default App;
