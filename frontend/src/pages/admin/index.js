import React, { useContext } from "react";
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";

export default class AdminPage extends React.Component {
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.state = {
			userData: undefined,
		};
	}

	async componentDidMount() {
		const { idToken, uid } = this.context.authState.user;
		// const userData = (await api.user.getAll(idToken)).data.data.users;
		const userData = [
			{ title: "Basic quantum circuit" },
			{ title: "Bell-state circuit" },
			{ title: "Quantum teleportation" },
			{ title: "A simple 8-bit adder" },
		]
		this.setState({ userData });
	}

	taskRow(data) {
		return (
			<TableRow hover onClick={this.handleRowSelect}>
				<TableCell>{data.title}</TableCell>
			</TableRow>
		);
	}

	render() {
		return (
			<Box>
				{JSON.stringify(this.state.userData)}
				<Paper variant="outlined" style={{ padding: 8, backgroundColor: "rgb(255, 81, 81)" }}>
					<Table component={Paper} my={2} variant="outlined">
						<TableBody>
							{console.log(this.state)}
							{/* {this.state.userData.map((data) => this.taskRow(data))} */}
						</TableBody>
					</Table>
				</Paper>
			</Box>
		);
	}
}
