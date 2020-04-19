import React from "react";
import { createUser } from "../../helpers/auth";
import './signup.css';

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
		<div>
			<form>
				<div class='container'>
					<h1>Sign Up</h1> 
					<p class="form">Please fill in this form to create account.</p>

					<hr></hr>

					<label for="email"><b>Email</b></label>
					<input type="text" placeholder="Enter Email" name="email" required></input>
					
					<label for="firstname"><b>First Name</b></label>
					<input type="text" placeholder="Enter First Name" name="firstname" required></input>
					
					<label for="lastname"><b>Last Name</b></label>
					<input type="text" placeholder="Enter Last Name" name="lastname" required></input>
					
					<label class="form"for="studentid"><b>Student ID</b></label>
					<input type="text" placeholder="Enter Student ID" name="studentid" required></input>
					
					<label for="psw"><b>Password</b></label>
					<input type="password" placeholder="Enter Password" name="psw" required></input>
					
					<label for="psw-repeat"><b>Repeat Password</b></label>
					<input type="password" placeholder="Repeat Password" name="psw-repeat" required></input>
					
					<div class="clearfix">
						<button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Cancel</button>
						<button type="submit" class="signupbtn">Sign Up</button>
					</div>
				</div>
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
