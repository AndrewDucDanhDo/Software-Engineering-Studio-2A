import React, { useEffect, useState, useContext } from "react";
import TeacherTaskViewer from "../../../components/teacherTaskViewer";
import { CircularProgress, makeStyles } from "@material-ui/core";
import api from "../../../helpers/api";
import { AuthContext } from "../../../context/auth";

const withStyles = makeStyles({
	spinner: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
});

export default function TeacherTaskEditorPage(props) {
	const taskId = props.match.params.taskId;
	const classes = withStyles();
	const [state, setState] = useState({});
	const { authState } = useContext(AuthContext);

	const fetchData = async () => {
		const results = await Promise.all([
			api.admin.tasks.getSingle(authState.user.idToken, taskId),
			api.admin.users.getAll(authState.user.idToken),
		]);

		setState({
			task: results[0].data.data,
			users: results[1].data.data.users,
		});
	};

	useEffect(() => {
		if (state.task === undefined) {
			fetchData();
		}
	});

	if (state.task === undefined) {
		return <CircularProgress className={classes.spinner} />;
	} else {
		return (
			<TeacherTaskViewer
				taskData={state.task}
				usersData={state.users}
				newTask={false}
			/>
		);
	}
}
