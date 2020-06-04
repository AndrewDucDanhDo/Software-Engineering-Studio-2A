import React, { useContext } from "react";
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
	CircularProgress,
	makeStyles,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";

const withStyles = makeStyles({
	spinner: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
});

const markMap = (marks) => {
	return marks.reduce((obj, item) => {
		obj[item.owner] = item.results;
		return obj;
	}, {});
};

const SubmissionRow = (props) => {
	const { submission, mark } = props;
	const history = useHistory();
	const classes = withStyles();
	const submissionInfo =
		mark.status === "" || mark.status === undefined ? "Needs Grading" : "Grading Complete";
	const submissionLink = `/admin/task/${submission.taskId}/submission/${submission.owner}`;

	return (
		<TableRow hover onClick={() => history.push(submissionLink)}>
			<TableCell>{submission.ownerData.displayName}</TableCell>
			<TableCell>{submissionInfo}</TableCell>
			<TableCell>{mark.submissionMark}</TableCell>
		</TableRow>
	);
};

const SubmissionTable = (props) => {
	const { submissions, marks } = props;
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
					<TableCell style={{ width: "4%" }}>
						<Typography variant="h6">Grade</Typography>
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{submissions.map((submission) => (
					<SubmissionRow submission={submission} mark={marks ? marks[submission.owner] : ""} />
				))}
			</TableBody>
		</Table>
	);
};

const SubmissionList = (props) => {
	const { submissions, taskId } = props;
	var marksData = markMap(submissions);
	const [state, setState] = React.useState({ marksData: marksData });
	const { authState } = useContext(AuthContext);
	const classes = withStyles();
	return (
		<Box m={1}>
			<Container>
				<Paper
					variant="outlined"
					style={{ padding: 8, backgroundColor: "rgb(224, 233, 236)" }}
				>
					<SubmissionTable submissions={submissions} marks={state.marksData} />
				</Paper>
				{state.marksData ? (
					<Button variant="contained"
						style={{
							fontSize: "16px",
							marginTop: '20px',
							float: 'right'
						}}
						size="large"
						color="primary"
						onClick={async () => {
							setState({ marksData: undefined });
							const res = await api.admin.tasks.mark(authState.user.idToken, taskId);
							setState({ marksData: markMap(res.data.data.results) });
						}}>Mark All</Button>
				) : (
						<CircularProgress className={classes.spinner} />
					)}
			</Container>
		</Box>
	);
};

export default SubmissionList;
