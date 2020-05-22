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
				displayName: `${this.state.form.firstName} ${this.state.form.lastName}`,
				email: this.state.form.email,
				password: this.state.form.password
			});
			this.setState({ 
				...this.state,
				success: true
			});
		}
		catch (error) {
			// We will get returned an axios error object here
			const errStatusCode = error.response.status;
			const errMessage = error.response.data;
			const errorCode = errMessage.errorCode;

			switch (errorCode){
				case "auth/email-already-exists":
					this.setState({
						...this.state,
						errorCode,
						errorMessage: "The email already been registered",
					});
			}
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
					{this.state.errorCode !== undefined && (
							<h2>{this.state.errorMessage}</h2>
						)}
					{this.state.success !== undefined && (
							<h2>Registration success, please login.</h2>
						)}
					<form onSubmit={this.handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								{/* firstName */}
								<TextField
									label="First Name"
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
									label="Email"
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
									label="Password (More than 6 characters)"
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

	render() {
		return this.signupForm();
	}
}

export default withStyles(styles)(SignUpPage);
