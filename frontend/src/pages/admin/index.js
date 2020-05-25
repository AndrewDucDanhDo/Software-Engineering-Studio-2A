import React from "react";
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableHead,
	CircularProgress,
	Button,
	Typography,
} from "@material-ui/core";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";

export default class AdminPage extends React.Component {
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.state = {
			allUsersData: undefined,
			selected: null,
		};
	}

	async componentDidMount() {
		const { idToken } = this.context.authState.user;
		const allUsersData = (await api.admin.users.getAll(idToken)).data.data
			.users;
		this.setState({ allUsersData });
	}

	handleRoleChange = (e, userId, roles) => {
		const { idToken } = this.context.authState.user;
		api.admin.users.roles.update(idToken, userId, roles);
	};

	handleUserDelete = (e, userId) => {
		const { idToken } = this.context.authState.user;
		api.admin.users.delete(idToken, userId);
	};

	userRow(data) {
		if (data.customClaims === undefined) data.customClaims = {};
		data.customClaims = {
			teacher: data.customClaims.teacher || false,
			superuser: data.customClaims.superuser || false,
		};
		return (
			<TableRow hover onClick={this.handleRowSelect}>
				<TableCell>{data.email}</TableCell>
				<TableCell>{data.displayName}</TableCell>
				<TableCell>{data.uid}</TableCell>
				<TableCell>
					<input
						name="teacher"
						type="checkbox"
						checked={data.customClaims.teacher}
						onChange={(e) => {
							data.customClaims.teacher = !data.customClaims.teacher;
							this.setState(this.state);
							this.handleRoleChange(e, data.uid, data.customClaims);
						}}
					/>
				</TableCell>
				<TableCell>
					<input
						name="teacher"
						type="checkbox"
						checked={data.customClaims.superuser}
						onChange={(e) => {
							data.customClaims.superuser = !data.customClaims.superuser;
							this.setState(this.state);
							this.handleRoleChange(e, data.uid, data.customClaims);
						}}
					/>
				</TableCell>
				<TableCell>
					<Button
						variant="contained"
						style={{ fontSize: "10px" }}
						size="small"
						onClick={(e) => {
							// this.state.allUsersData =
							// this.setState(this.state);
							this.setState({
								...this.state,
								allUsersData: this.state.allUsersData.filter(
									(user) => user.uid !== data.uid
								),
							});

							this.handleUserDelete(e, data.uid);
						}}
					>
						DELETE
					</Button>
				</TableCell>
			</TableRow>
		);
	}

	render() {
		return (
			<Box>
				{/* We need to wait for the state to be populated before trying to display the results */}
				{this.state.allUsersData !== undefined ? (
					<Paper variant="outlined">
						<Box m={4}>
							<Table component={Paper} my={2} variant="outlined">
								<TableHead>
									<TableCell>
										<Typography variant="h6">Email</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="h6">Display Name</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="h6">User Id</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="h6">Teacher Role</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="h6">Super User Role</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="h6">Actions</Typography>
									</TableCell>
								</TableHead>
								<TableBody>
									{this.state.allUsersData.map((userData) =>
										this.userRow(userData)
									)}
								</TableBody>
							</Table>
						</Box>
					</Paper>
				) : (
					<CircularProgress
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}
					/>
				)}
			</Box>
		);
	}
}
