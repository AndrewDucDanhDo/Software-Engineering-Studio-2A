import React from "react";
import "./styles/App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// Components
import Navigation from "./components/navigation";

// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import TeacherEditorPage from "./pages/teacherEditor";
import TeacherTasksPage from "./pages/teacherTasks";
import TeacherTaskViewerPage from "./pages/teacherTaskViewer";

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
						<Route path="/teacherTasks">
						   <TeacherTasksPage/>
						</Route>
						<Route path="/teacherTaskViewer">
							<TeacherTaskViewerPage/>
						</Route>
						<Route path="/teacherEditor">
							<TeacherEditorPage/>
						</Route>
            			<Route path="/">
							<HomePage/>
						</Route>
					</Switch>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
