import React from "react";
import { Link } from "react-router-dom";
import {loginUser} from "../../helpers/auth";
import {withStyles} from "@material-ui/styles";
import {TextField} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const styles = {
	root : {
	    height: '100vh',
	},
	test : {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	submit: {
		display: 'flex',
	},
	image: {
		backgroundImage: 'url(https://source.unsplash.com/featured/?technology,hacker)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		height: '90vh',
	  },
	card: {
		justify: 'center',
		alignItems: 'center',
		paddingTop: '20vh',
	}
}

export class LoginPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			success: undefined,
			form: {
				email: "",
				password: "",
			},
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleFormChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		// TODO: Theres probably a better way of doing this but i don't remember how rn
		this.setState({
			...this.state,
			form: { ...this.state.form, [name]: value },
		});
	};

	handleLogin = async (event) => {
		event.preventDefault();
		try {
			// TODO: Do something more with this response maybe
			const res = await loginUser(this.state.form.email, this.state.form.password);
			console.log(res);
			this.setState({ ...this.state, success: true });
		} catch (error) {
			console.log(error);
			this.setState({ ...this.state, success: false });
		}
	};

	loginSuccess = () => {
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

	loginError = () => {
		return <p>Login was a failure</p>;
	};

	loginForm = () => {
		return (
		<Grid container component="main" classname={this.props.classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={this.props.classes.image} />
			<Grid item xs={12} sm={8} md={5} elevation={6} square className={this.props.classes.card}>
				<div className={this.props.classes.test}>
					<Avatar>
						<LockOutlinedIcon />
					</Avatar>
					<h1>Login</h1>
					<form onSubmit={this.handleLogin}>
						{/* email */}
						<div>
							<TextField
							label="email" 
							variant="outlined"
							margin="normal"
							name="email"
							required
							fullWidth 
							onChange={this.handleFormChange}
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
							onChange={this.handleFormChange}
							/>
						</div>
						<br></br>
						<Button
						variant="contained" 
						type="submit"
						fullWidth
						classname={this.props.classes.submit}
						>
						Submit
						</Button>
					</form>
				</div>
			</Grid>
		</Grid>
			
		);
	};

	render() {
		// Show the login form if the user hasn't successfully login in yet
		if (this.state.success === undefined) {
			return this.loginForm();
		} else if (this.state.success === true) {
			// Show a success message when the user is able to success fully login
			return this.loginSuccess();
		} else if (this.state.success === false) {
			// Show an error message when the user is unable to login
			return this.loginError();
		}
	}
}

export default withStyles(styles)(LoginPage);
