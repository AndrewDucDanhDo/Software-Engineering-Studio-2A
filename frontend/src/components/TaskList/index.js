import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
	Box, Button, CircularProgress, Container, makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow,
	Typography,
} from "@material-ui/core";
import { AuthContext } from "../../context/auth";
import api from "../../helpers/api";

const withStyles = makeStyles({
	spinner: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
});

const isAdminUser = (authState) => {
	return (
		authState.user.claims !== undefined &&
		(authState.user.claims.teacher || authState.user.claims.superuser)
	);
};

const TaskList = () => {
	const [state, setState] = React.useState({ tasks: undefined });
	const classes = withStyles();
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

	const taskRow = (task) => {
		const taskPath = isAdminUser(authState)
			? `/admin/task/${task.taskId}`
			: `/student/task/${task.taskId}`;

		const buildSubmissionStatus = (task) => {
			let submissionString = "Waiting for submission";
			if (task.submissionReceived) {
				if (task.submissionEvaluated) {
					submissionString = "Submitted - Graded";
				} else {
					submissionString = "Submitted - Needs Grading";
				}
			}
			return <TableCell>{submissionString}</TableCell>;
		};

		return (
			<TableRow key={task.taskId} hover onClick={() => history.push(taskPath)}>
				<TableCell>{task.name}</TableCell>
				<TableCell>{task.summary}</TableCell>
				{!isAdminUser(authState) && buildSubmissionStatus(task)}
			</TableRow>
		);
	};

	const buildTaskTable = () => {
		return (
			<Table component={Paper} my={2} variant="outlined">
				<TableHead>
					<TableRow>
						<TableCell style={{ width: "20%" }}>
							<Typography variant="h5">Task</Typography>
						</TableCell>
						<TableCell style={{ width: "50%" }}>
							<Typography variant="h5">Summary</Typography>
						</TableCell>
						{!isAdminUser(authState) && (
							<TableCell style={{ width: "20%" }}>
								<Typography variant="h5">Submission Status</Typography>
							</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{state.tasks.map((task) => {
						return taskRow(task);
					})}
				</TableBody>
			</Table>
		);
	};

	const buildAdminControls = () => {
		return (
			<Button
				component={Link}
				to="/admin/task/new-task"
				variant="contained"
				color="primary"
			>
				Create New Task
			</Button>
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
					<CircularProgress className={classes.spinner} />
				) : (
					buildTaskTable()
				)}
			</Paper>

			{isAdminUser(authState) && (
				<Box display="flex" flexDirection="row-reverse" my={2} mr={5}>
					{buildAdminControls()}
				</Box>
			)}
		</Container>
	);
};

export default TaskList;
