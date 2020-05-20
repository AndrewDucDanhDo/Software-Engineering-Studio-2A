import React from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../helpers/auth";
import { TextField, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { AuthContext } from "../../context/auth";

const useStyles = makeStyles({
	root: {
		height: "100vh",
	},
	test: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	submit: {
		display: "flex",
	},
	image: {
		backgroundImage:
			"url(https://source.unsplash.com/featured/?technology,hacker)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		backgroundPosition: "center",
		height: "90vh",
	},
	card: {
		justify: "center",
		alignItems: "center",
		paddingTop: "20vh",
	},
});

export default function LoginPage() {
	const [state, setState] = React.useState({
		success: undefined,
		form: {
			email: "",
			password: "",
		},
	});
	const { authState, setAuthState } = React.useContext(AuthContext);
	const classes = useStyles();

	const handleFormChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		// TODO: Theres probably a better way of doing this but i don't remember how rn
		setState({
			...state,
			form: { ...state.form, [name]: value },
		});
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			// TODO: Do something more with this response maybe
			const userDetails = await loginUser(
				state.form.email,
				state.form.password
			);
			// Set the global auth context to reflect the succesfful login
			setAuthState({
				authenticated: true,
				idToken: userDetails.idToken,
				user: userDetails.user,
			});
			setState({ ...state, success: true });
		} catch (error) {
			console.log(error);
			setState({ ...state, success: false });
		}
	};

	const loginSuccess = () => {
		return (
			<Grid container justify="center" alignItems="center">
				<div>
					<h1>Login was a success</h1>
					<div>
						<Button
							variant="contained"
							color="inherit"
							component={Link}
							to="/teacherTaskEditor"
						>
							Teacher Portal
						</Button>
						<Button
							variant="contained"
							color="inherit"
							component={Link}
							to="/homepage"
						>
							Student Portal
						</Button>
					</div>
				</div>
			</Grid>
		);
	};

	const loginError = () => {
		return <p>Login was a failure</p>;
	};

	const loginForm = () => {
		return (
			<Grid container component="main" classname={classes.root}>
				<CssBaseline />
				<Grid item xs={false} sm={4} md={7} className={classes.image} />
				<Grid
					item
					xs={12}
					sm={8}
					md={5}
					elevation={6}
					square
					className={classes.card}
				>
					<div className={classes.test}>
						<Avatar>
							<LockOutlinedIcon />
						</Avatar>
						<h1>Login</h1>
						<form onSubmit={handleLogin}>
							{/* email */}
							<div>
								<TextField
									label="email"
									variant="outlined"
									margin="normal"
									name="email"
									required
									fullWidth
									onChange={handleFormChange}
								/>
							</div>
							{/* password */}
							<div>
								<TextField
									label="password"
									variant="outlined"
									margin="normal"
									name="password"
									required
									fullWidth
									type="password"
									onChange={handleFormChange}
								/>
							</div>
							<br></br>
							<Button
								variant="contained"
								type="submit"
								fullWidth
								classname={classes.submit}
							>
								Submit
							</Button>
						</form>
					</div>
				</Grid>
			</Grid>
		);
	};

	// Show the login form if the user hasn't successfully login in yet
	if (state.success === undefined) {
		return loginForm();
	} else if (state.success === true) {
		// Show a success message when the user is able to success fully login
		return loginSuccess();
	} else if (state.success === false) {
		// Show an error message when the user is unable to login
		return loginError();
	}
}
