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
	const { taskId, submissionId } = props.match.params;
	const classes = withStyles();
	const { authState } = useContext(AuthContext);
	const [state, setState] = useState({});

	const fetchData = async () => {
		const results = await Promise.all([
			api.admin.tasks.getSingle(authState.user.idToken, taskId),
		]);

		setState({
			task: results[0].data.data,
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
			<>
				Submission editor page taskId: {taskId} submissionId: {submissionId}
			</>
		);
	}
}
