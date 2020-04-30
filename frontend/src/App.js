import React from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles"

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


function App() {
	return (
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
								<LoginPage />
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
								<TeacherTaskEditorPage/>
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
	);
}

export default App;
