import React from "react";
import { createUser } from "../../helpers/auth";

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
			await createUser({ ...this.state.form });
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
			<div style={{padding: "10px" }}>
				<h2>Im the sign up page</h2>
				<form onSubmit={this.handleSubmit}>
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
					{/* firstName */}
					<div>
						<label>First Name</label>
						<input
							type="text"
							placeholder="First Name"
							name="firstName"
							required
							onChange={this.handleFormChange}
						/>
					</div>
					{/* lastName */}
					<div>
						<label>Last Name</label>
						<input
							type="text"
							placeholder="Last Name"
							name="lastName"
							required
							onChange={this.handleFormChange}
						/>
					</div>
					<button type="submit">Submit</button>
				</form>
			</div>
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

export default SignUpPage;
