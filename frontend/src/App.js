import React from "react";
import "./styles/App.css";

import {BrowserRouter, Route, Switch} from "react-router-dom";
// Components
import Navigation from "./components/navigation";
import Footer from "./components/footer";

// import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { Link } from 'react-router-dom';
// import QuantumSimulator from "./components/quantum";
// import Header from "./components/header";
// import Footer from "./components/footer";


// // Components
import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';

// Pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
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
            			<Route path="/">
							<HomePage/>
						</Route>
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		</div>
// 	<BrowserRouter>
// 		<Switch>
// 			<div className="App container">
// 				<AppBar position="static">
// 					<Toolbar>
// 						<Typography variant="h5" className={classes.title} component={Link} to="/">
// 							Quantum Circuit Simulator Group 2
// 						</Typography>
// 							<Button className={classes.signup} color="inherit" component={Link} to="/signup"> Sign Up</Button>
// 							<Button color="inherit" component={Link} to="/login">Login</Button>
// 					</Toolbar>
// 				</AppBar>
// 				<Switch>
// 					<Route path="/signup">
// 						<SignupPage />
// 						<Footer />
// 					</Route>
// 					<Route path="/login">
// 						<LoginPage />
// 						<Footer />
// 					</Route>
// 					<Route path="/">
// 						{/* <HomePage /> */}
// 						<QuantumSimulator />
// 						<Footer />
// 					</Route>
// 				</Switch>
// 			</div>
// 		</Switch>
// 	</BrowserRouter>
	);
}

export default App;
