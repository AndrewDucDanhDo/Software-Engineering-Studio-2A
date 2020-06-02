import React from "react";
import {
	Container,
	Typography,
	Box,
	Paper,
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const SubmissionRow = (props) => {
	const { submission } = props;
	const history = useHistory();
	const submissionInfo =
		submission.results.status === "" ? "Grading Complete" : "Needs Grading";
	const submissionLink = `/admin/task/${submission.taskId}/submission/${submission.owner}`;

	return (
		<TableRow hover onClick={() => history.push(submissionLink)}>
			<TableCell>{submission.ownerData.displayName}</TableCell>
			<TableCell>{submissionInfo}</TableCell>
		</TableRow>
	);
};

const SubmissionTable = (props) => {
	const { submissions } = props;
	return (
		<Table component={Paper} my={2} variant="outlined">
			<TableHead>
				<TableRow>
					<TableCell style={{ width: "20%" }}>
						<Typography variant="h6">Display name</Typography>
					</TableCell>
					<TableCell style={{ width: "50%" }}>
						<Typography variant="h6">Submission Status</Typography>
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{submissions.map((submission) => (
					<SubmissionRow submission={submission} />
				))}
			</TableBody>
		</Table>
	);
};

const SubmissionList = (props) => {
	const { submissions } = props;

	return (
		<Box m={1}>
			<Container>
				<Paper
					variant="outlined"
					style={{ padding: 8, backgroundColor: "rgb(224, 233, 236)" }}
				>
					<SubmissionTable submissions={submissions} />
				</Paper>
			</Container>
		</Box>
	);
};

export default SubmissionList;
