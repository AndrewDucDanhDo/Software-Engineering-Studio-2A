import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import { AuthContext } from "../../context/auth";
import api from "../../helpers/api";
import { useHistory } from "react-router-dom";

const isAdminUser = (authState) => {
	return (
		authState.user.claims !== undefined &&
		(authState.user.claims.teacher || authState.user.claims.superuser)
	);
};

const TaskList = () => {
	const [state, setState] = React.useState({ tasks: undefined });
	const { authState } = React.useContext(AuthContext);
	const history = useHistory();

	useEffect(() => {
		if (state.tasks === undefined) {
			fetchTaskList();
		}
	});

	const fetchTaskList = async () => {
		if (isAdminUser(authState)) {
			const res = await api.admin.tasks.getAll(authState.user.idToken);
			setState({ ...state, tasks: res.data.data });
		} else {
			const res = await api.task.getAll(authState.user.idToken);
			setState({ ...state, tasks: res.data.data });
		}
	};

	const taskRow = (taskId, name, description) => {
		const taskPath = isAdminUser(authState)
			? `/admin/task/${taskId}`
			: `/student/task/${taskId}`;

		return (
			<TableRow hover onClick={() => history.push(taskPath)}>
				<TableCell style={{ width: "30%" }}>{name}</TableCell>
				<TableCell style={{ width: "70%" }}>{description}</TableCell>
			</TableRow>
		);
	};

	return (
		<Container>
			<Box my={2} ml={4} textAlign="left">
				<Typography variant="h4">Task List</Typography>
			</Box>
			<Paper
				variant="outlined"
				style={{ padding: 8, backgroundColor: "rgb(224, 233, 236)" }}
			>
				{state.tasks === undefined ? (
					<CircularProgress />
				) : (
					<Table component={Paper} my={2} variant="outlined">
						<TableHead>
							<TableRow>
								<TableCell style={{ width: "30%" }}>Tasks</TableCell>
								<TableCell style={{ width: "70%" }}>Description</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{state.tasks.map((task) => {
								return taskRow(task.taskId, task.name, task.description);
							})}
						</TableBody>
					</Table>
				)}
			</Paper>
			<Box display="flex" flexDirection="row-reverse" my={2} mr={5}>
				{isAdminUser(authState) && (
					<Button
						component={Link}
						to="/admin/task/new-task"
						variant="contained"
						color="primary"
					>
						Create New Task
					</Button>
				)}
			</Box>
		</Container>
	);
};

export default TaskList;
