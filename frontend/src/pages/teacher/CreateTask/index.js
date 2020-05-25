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

export default function CreateTaskPage(props) {
	const [state, setState] = useState({});
	const classes = withStyles();
	const { authState } = useContext(AuthContext);

	const fetchData = async () => {
		const results = await Promise.all([
			api.admin.users.getAll(authState.user.idToken),
		]);

		setState({
			task: {
				admin: authState.user.uid,
				name: "New Task",
				summary: "Some short summary",
				description: "Some longer description",
				expectedResults: [],
				owners: [authState.user.uid],
				assigned: [],
			},
			users: results[0].data.data.users,
		});
	};

	useEffect(() => {
		if (state.users === undefined) {
			fetchData();
		}
	});

	if (state.users === undefined) {
		return <CircularProgress className={classes.spinner} />;
	} else {
		return (
			<TeacherTaskViewer
				taskData={state.task}
				usersData={state.users}
				newTask={true}
			/>
		);
	}
}
