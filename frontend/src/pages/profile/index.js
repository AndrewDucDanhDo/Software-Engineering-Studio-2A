import React, { useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import Profile from "../../components/profile";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";

export default class ProfilePage extends React.Component {
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.state = {
			userData: undefined,
		};
	}

	async componentDidMount() {
		const { idToken, uid } = this.context.authState.user;
		const profileData = (await api.user.get(idToken, uid)).data.data;
		const userData = {idToken, uid, profileData};
		this.setState({ userData });
	}

	render() {
		return (
			<Box>
				<Profile userData={this.state.userData} />
			</Box>
		);
	}
}
