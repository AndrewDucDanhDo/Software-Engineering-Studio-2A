import React, { useContext } from "react";
import {
	Box,
	Button,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	CircularProgress,
} from "@material-ui/core";
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
		const userData = (await api.user.getAll(idToken)).data.data.users;
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
				{/* We need to wait for the state to be populated before trying to display the results */}
				{this.state.userData !== undefined ? (
					<Paper
						variant="outlined"
						style={{ padding: 8, backgroundColor: "rgb(255, 81, 81)" }}
					>
						<Table component={Paper} my={2} variant="outlined">
							<TableBody>
								{this.state.userData.map((data) => this.taskRow(data))}
							</TableBody>
						</Table>
					</Paper>
				) : (
					<CircularProgress />
				)}
			</Box>
		);
	}
}
