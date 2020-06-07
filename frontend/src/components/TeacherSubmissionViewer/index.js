import React from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Button,
	Card,
	Grid,
	Paper,
	Typography,
	TextField,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	withStyles,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Container,
	Tabs,
	Tab,
} from "@material-ui/core";
import QuCircuit from "../quCircuit";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";
import Toast from "../Toast/toast";
import { useHistory } from "react-router-dom";
import {
	CircuitResultsContext,
	CircuitStructureContext,
} from "../../context/circuit";
import { reduceAmplitude } from "../../helpers/quCircuit/formatters";
import TabPanel from "../TabPanel";

const styles = {
	palette: {
		primary: {
			light: "#757ce8",
			main: "#43a047",
			dark: "#2e7d32",
			contrastText: "#fff",
		},
		secondary: {
			light: "#757ce8",
			main: "#e53935",
			dark: "#b71c1c",
			contrastText: "#fff",
		},
	},
};

const TeacherSubmissionViewer = (props) => {
	const { taskId, userId, submission } = props;
	const { authState } = React.useContext(AuthContext);
	const history = useHistory();
	const circuitStructure = React.useContext(CircuitStructureContext);

	const [state, setState] = React.useState(submission);
	const [resultsState, setResultsState] = React.useState(submission.results);
	const [toastState, setToastState] = React.useState({ open: false });

	const handleResultsSave = async () => {
		try {
			console.log("resultsState", resultsState);
			await api.admin.tasks.submission.update(
				authState.user.idToken,
				taskId,
				userId,
				{ ...resultsState, assessor: authState.user.uid }
			);
			return setToastState({
				open: true,
				severity: "success",
				message: "Grade successfully updated.",
			});
		} catch (error) {
			return setToastState({
				open: true,
				severity: "error",
				message: "An unknown error occurred while trying to update grade.",
			});
		}
	};

	const handleResultsChange = (event) => {
		const { id, value } = event.target;

		if (id === 'totalMarks' || id == 'submissionMark')
			resultsState[id] = parseInt(value);
		else
			resultsState[id] = value;

		resultsState.status = "PASS"
		if ((resultsState.submissionMark / resultsState.totalMarks) < 0.5)
			resultsState.status = "FAIL"

		setResultsState({ ...resultsState });
	};

	const extrasBox = () => {
		return (
			<Card variant="outlined" style={{ padding: 20 }}>
				<Container>
					<Box m={1}>
						<Button
							variant="contained"
							style={{ fontSize: "10px" }}
							size="small"
							component={Link}
							color="primary"
							onClick={async () => {
								const res = await api.admin.tasks.submission.mark(authState.user.idToken, taskId, userId);
								setResultsState(res.data.data.results);
							}}
							fullWidth
							>
							Auto Mark
						</Button>
					</Box>
					<Box m={1}>
						<Button
							variant="contained"
							style={{ fontSize: "10px" }}
							size="small"
							component={Link}
							to={`/admin/task/${taskId}`}
							fullWidth
						>
							Back to submissions
						</Button>
					</Box>
				</Container>
			</Card>
		);
	};

	const buildToast = () => {
		return (
			<Toast
				severity={toastState.severity}
				message={toastState.message}
				onClose={() => setToastState({ open: false })}
			/>
		);
	};

	const buildSimulator = () => {
		return <QuCircuit initialCircuit={state.circuit} />;
	};

	const buildCenterContent = () => {
		if (state.circuit === undefined) {
			// return <CircularProgress className={classes.spinner} />;
			return "loading";
		} else {
			return (
				<>
					{buildSimulator()}
				</>
			);
		}
	};

	return (
		<Grid
			container
			style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<Grid
				xs={2}
				component={Paper}
				item
				style={{
					backgroundColor: "#f7f7f7",
					height: "93.5%",
					overflow: "scroll",
				}}
			>
				<Box m={1}>
					<ExpansionPanel defaultExpanded={false} style={{ height: "50%" }}>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography variant="h6">Functional Input</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Box textAlign="center">
								{/* TODO: Show the marking results */}
							</Box>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Box>
				<Box m={1}>
					<Box my={1}>
						<Card variant="outlined" style={{ padding: 8 }}>
							<Box>
								<Box m={2} textAlign="left">
									<Typography variant="h6">Manual Grading</Typography>
								</Box>
								<Container>
									<TextField
										id="submissionMark"
										label="Grade"
										variant="outlined"
										size="small"
										margin="dense"
										type="number"
										fullWidth
										onChange={handleResultsChange}
										value={resultsState.submissionMark}
									/>
									<TextField
										id="totalMarks"
										label="Max"
										variant="outlined"
										size="small"
										type="number"
										margin="dense"
										fullWidth
										onChange={handleResultsChange}
										value={resultsState.totalMarks}
									/>
									<TextField
										id="comment"
										label="Comment"
										variant="outlined"
										size="small"
										margin="dense"
										multiline
										rows={8}
										fullWidth
										type="text"
										onChange={handleResultsChange}
										value={resultsState.comment}
									/>
									<Box m={2} textAlign="center">
										<Button
											onClick={handleResultsSave}
											variant="contained"
											color="primary"
											style={{ fontSize: "10px" }}
											size="small"
											startIcon={<SaveIcon />}
											fullWidth
										>
											Save
									</Button>
									</Box>
								</Container>
							</Box>
						</Card>
					</Box>

					<Box my={1}>{extrasBox()}</Box>
				</Box>
			</Grid>
			<Grid xs={10} item>
				{buildCenterContent()}
			</Grid>
			{/* Utility components that are displayed when needed */}
			{toastState.open && buildToast()}
		</Grid>
	);
};

export default withStyles(styles)(TeacherSubmissionViewer);
