import React from "react";
import "./styles/App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Components
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import StudentNavigation from "./components/studentnav";
import TeacherNavigation from "./components/teachernav";

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
import { AuthContext } from "./context/auth";

function App() {
	const [authState, setAuthState] = React.useState({ authenticated: false });
	const authStateValue = { authState, setAuthState };

	return (
		<AuthContext.Provider value={authStateValue}>
			<div className="App">
				<ThemeProvider theme={appTheme}>
					<BrowserRouter>
						<div>
							<Switch>
								<Route path="/signup">
									<Navigation />
									<SignupPage />
								</Route>

								<Route path="/login">
									<Navigation />
									<LoginPage foo="bar" />
								</Route>

								<Route path="/teacherTasks">
									<TeacherNavigation />
									<TeacherTasksPage />
								</Route>

								<Route path="/teacherTaskViewer">
									<TeacherNavigation />
									<TeacherTaskViewerPage />
								</Route>

								<Route path="/teacherTaskEditor">
									<TeacherNavigation />
									<TeacherTaskEditorPage />
								</Route>

								<Route path="/profile">
									<StudentNavigation />
									<ProfilePage />
								</Route>

								<Route path="/homepage">
									<StudentNavigation />
									<HomePage />
								</Route>

								<Route path="/">
									<Navigation />
									<LoginPage />
								</Route>
							</Switch>
							<Footer />
						</div>
					</BrowserRouter>
				</ThemeProvider>
			</div>
		</AuthContext.Provider>
	);
}

export default App;
