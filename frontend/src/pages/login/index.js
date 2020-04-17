import React from "react";
import {loginUser} from "../../helpers/auth";
import {withStyles} from "@material-ui/styles";

const styles = {
	test : {
		color: 'black',
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
			const res = loginUser(this.state.form.email, this.state.form.password);
			console.log(res);
			this.setState({ ...this.state, success: true });
		} catch (error) {
			console.log(error);
			this.setState({ ...this.state, success: false });
		}
	};

	loginSuccess = () => {
		return <p>Login was a success</p>;
	};

	loginError = () => {
		return <p>Login was a failure</p>;
	};

	loginForm = () => {
		return (
			
			<div className={this.props.classes.test}>
				<h2>Im the login page</h2>
				<form onSubmit={this.handleLogin}>
					{/* email */}
					<div>
						<label>Email</label>
						<input
							type="text"
							placeholder="Email"
							name="email"
							required
							onChange={this.handleFormChange}
						/>
					</div>
					{/* password */}
					<div>
						<label>Password</label>
						<input
							type="text"
							placeholder="Password"
							name="password"
							required
							onChange={this.handleFormChange}
						/>
					</div>

					<button type="Login">Submit</button>
				</form>
			</div>
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
