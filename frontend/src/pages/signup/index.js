import React from "react";
import { createUser } from "../../helpers/auth";
import {withStyles} from "@material-ui/styles";
import {TextField, Grid} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const styles = {
	test : {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: '10vh',
	},
	submit: {
		display: 'flex',
	},
}

export class SignUpPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			success: undefined,
			form: {
				email: "",
				password: "",
				firstName: "",
				lastName: "",
			},
		};

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleFormChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		// TODO: Theres probably a better way of doing this but i don't remember how rn
		this.setState({
			...this.state,
			form: { ...this.state.form, [name]: value },
		});
	}

	handleSubmit = async (event) => {
		// Stop the form element from adding query params by default
		event.preventDefault();
		try {
			await createUser({
				email: this.state.form.email,
				password: this.state.form.password,
				displayName: `${this.state.form.firstName} ${this.state.form.lastName}`
			});
			this.setState({ ...this.state, success: true });
		} catch (error) {
			// We will get returned an axios error object here
			const errStatusCode = error.response.status;
			const errMessage = error.response.data;
			console.error({
				errStatusCode,
				errMessage,
			});
			// TODO: Have the frontend display the specific returned error would be good
			this.setState({ ...this.state, success: false });
		}
	};

	signupForm = () => {
		return (
			<Container Component="main" maxWidth="xs">
				<div className={this.props.classes.test}>
					<Avatar>
						<LockOutlinedIcon />
					</Avatar>
					<h1>Sign Up</h1>
					<form onSubmit={this.handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								{/* firstName */}
								<TextField
									label="firstName"
									variant="outlined"
									name="firstName"
									required
									Fullwidth
									autoFocus
									onChange={this.handleFormChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								{/* lastName */}
								<TextField
									label="Last Name"
									variant="outlined"
									name="lastName"
									required
									Fullwidth
									onChange={this.handleFormChange}
								/>
							</Grid>
							<Grid item xs={12}>
								{/* email */}
								<TextField
									label="email"
									variant="outlined"
									name="email"
									required
									fullWidth
									onChange={this.handleFormChange}
								/>
							</Grid>
							<Grid item xs={12}>
								{/* password */}
								<TextField
									label="password"
									variant="outlined"
									name="password"
									required
									fullWidth
									onChange={this.handleFormChange}
								/>
							</Grid>
							<br />
							<Button
							variant="contained"
							type="submit"
							fullWidth
							classname={this.props.classes.submit}
							>
							Submit
							</Button>
						</Grid>
					</form>
				</div>
			</Container>
		);
	};

	signupSuccess = () => {
		return <p>Signup was a success</p>;
	};

	signupError = () => {
		return <p>Signup was a failure</p>;
	};

	render() {
		// Show the signup form when we haven't successfully registered the user
		if (this.state.success === undefined) {
			return this.signupForm();
		} else if (this.state.success === true) {
			// Show a success message when the user is able to success fully signup
			return this.signupSuccess();
		} else if (this.state.success === false) {
			// Show an error message when the user is unable to signup
			return this.signupError();
		}
	}
}

export default withStyles(styles)(SignUpPage);
