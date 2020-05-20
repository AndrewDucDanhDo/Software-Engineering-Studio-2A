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

function App() {
	return (
		<AuthProvider>
			<div className="App">
				<ThemeProvider theme={appTheme}>
					<BrowserRouter>
						<Navigation />
						<div>
							<Switch>
								<Route path="/signup">
									<SignupPage />
								</Route>

								<Route path="/login">
									<LoginPage />
								</Route>

								<Route path="/teacherTasks">
									<TeacherTasksPage />
								</Route>

								<Route path="/teacherTaskViewer">
									<TeacherTaskViewerPage />
								</Route>

								<Route path="/teacherTaskEditor">
									<TeacherTaskEditorPage />
								</Route>

								<Route path="/profile">
									<ProfilePage />
								</Route>

								<Route path="/">
									<HomePage />
								</Route>
							</Switch>
							<Footer />
						</div>
					</BrowserRouter>
				</ThemeProvider>
			</div>
		</AuthProvider>
	);
}

export default App;
