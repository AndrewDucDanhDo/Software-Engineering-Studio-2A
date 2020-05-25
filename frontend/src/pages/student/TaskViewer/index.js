import React, { useEffect, useState, useContext } from "react";
import StudentTaskViewer from "../../../components/StudentTaskViewer";
import { CircularProgress } from "@material-ui/core";
import api from "../../../helpers/api";
import { AuthContext } from "../../../context/auth";

export default function StudentTaskViewerPage(props) {
	const taskId = props.match.params.taskId;
	const [state, setState] = useState({});
	const { authState } = useContext(AuthContext);

	const fetchData = async () => {
		const results = await Promise.all([
			api.task.getSingle(authState.user.idToken, taskId),
			api.task.submission.get(authState.user.idToken, taskId),
		]);

		setState({
			task: results[0].data.data,
			submission: results[1].data.data,
		});
	};

	useEffect(() => {
		if (state.task === undefined) {
			fetchData();
		}
	});

	if (state.task === undefined) {
		return <CircularProgress />;
	} else {
		return (
			<StudentTaskViewer
				taskId={taskId}
				taskData={state.task}
				submissionData={state.submission}
			/>
		);
	}
}
