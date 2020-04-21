import React from "react";
import "./styles/App.css";
import {BrowserRouter, Route, Switch} from "react-router-dom";

// Components
import Navigation from "./components/navigation";

// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import TeacherTaskEditorPage from "./pages/teacherTaskEditor";
import TeacherTasksPage from "./pages/teacherTasks";
import TeacherTaskViewerPage from "./pages/teacherTaskViewer";

const useStyles = makeStyles((theme) => ({
	root: {
	  flexGrow: 1,
	},
	signup: {
	  marginRight: theme.spacing(3),
	},
	title: {
	  flexGrow: 1,
	},
  }));

function App() {
	const classes = useStyles();
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
						<Route path="/teacherTasks">
						   <TeacherTasksPage/>
						</Route>
						<Route path="/teacherTaskViewer">
							<TeacherTaskViewerPage/>
						</Route>
						<Route path="/teacherTaskEditor">
							<TeacherTaskEditorPage/>
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
		</div>
	);
}

export default App;
