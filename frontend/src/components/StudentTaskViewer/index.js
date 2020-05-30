import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Button,
	Card,
	Grid,
	Paper,
	Typography,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	makeStyles,
	Container,
	Divider,
} from "@material-ui/core";
import QuCircuit from "../quCircuit";
import SaveIcon from "@material-ui/icons/Save";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";
import Toast from "../Toast/toast";
import { CircuitStructureContext } from "../../context/circuit";
import { reduceAmplitude } from "../../helpers/quCircuit/formatters";

const withStyles = makeStyles({
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
	sectionHeading: {
		fontSize: 27,
	},
	sectionSuHeading: {
		fontSize: 22,
	},
	button: {
		fontSize: 11,
	},
	root: {
		position: "absolute",
		width: "100%",
		height: "100%",
		overflow: "hidden",
	},
	taskControls: {
		backgroundColor: "#f7f7f7",
		height: "93.5%",
		overflow: "scroll",
		overflow: "hidden",
	},
	expectedResults: {
		fontSize: 15,
	},
});

// All the static strings for ui elements should be declared here
const textContent = {
	taskOverview: {
		sectionTitle: "Task Overview",
		nameHeading: "Name",
		descriptionHeading: "Description",
	},
	expectedResults: {
		sectionTitle: "Expected Results",
	},
	submissionControls: {
		useCurrentCircuit: "Set current circuit to task submission",
		save: "Save submission",
		back: "Back to task selection",
	},
};

const StudentTaskViewer = (props) => {
	const { taskId, taskData, submissionData } = props;
	const classes = withStyles();

	// CONTEXT
	const { authState } = React.useContext(AuthContext);
	const circuitStructure = React.useContext(CircuitStructureContext);

	// STATE
	const [toastState, setToastState] = React.useState({ open: false });
	const [editorTouched, setEditorTouched] = React.useState(false);
	const [circuitState, setCircuitState] = React.useState(
		submissionData.circuit
	);

	const handleTaskSave = async () => {
		const requestData = circuitState;
		try {
			// Check if a submission has been made before via ownerId
			// to check whether to use the update or create endpoint
			if (submissionData.owner === undefined) {
				await api.task.submission.create(
					authState.user.idToken,
					taskId,
					requestData
				);
			} else {
				await api.task.submission.update(
					authState.user.idToken,
					taskId,
					requestData
				);
			}

			setEditorTouched(false);
			setToastState({
				open: true,
				severity: "success",
				message: "Submission successfully saved.",
			});
		} catch (error) {
			setToastState({
				open: true,
				severity: "error",
				message: "An unknown error occurred will trying to save a submission.",
			});
		}
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

	const buildTaskControls = () => {
		return (
			<Box m={1}>
				<Box>
					<ExpansionPanel defaultExpanded={true}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant="h3" className={classes.sectionHeading}>
								{textContent.taskOverview.sectionTitle}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Container>
								<Box mb={1}>
									<Typography variant="h4" className={classes.sectionSuHeading}>
										{textContent.taskOverview.nameHeading}
									</Typography>
									<Typography variant="body1">{taskData.name}</Typography>
								</Box>
								<Box mb={1}>
									<Typography variant="h4" className={classes.sectionSuHeading}>
										{textContent.taskOverview.descriptionHeading}
									</Typography>
									<Typography variant="body1">
										{taskData.description}
									</Typography>
								</Box>
							</Container>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Box>
				<Box my={1}>
					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant="h3" className={classes.sectionHeading}>
								{textContent.expectedResults.sectionTitle}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Container>
								<Box textAlign="center" style={{ display: "contents" }}>
									{taskData.expectedResults.map((result, index) => {
										const amp = reduceAmplitude(result.amplitude);
										const stat = result.state;
										const prob = Math.floor(result.probability);
										if (prob > 0) {
											return (
												<Typography
													variant="body1"
													key={index}
													className={classes.expectedResults}
												>
													&lt;{`${amp}|${stat}`}&gt; {prob}%
												</Typography>
											);
										}
									})}
								</Box>
							</Container>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Box>
				<Box my={1}>
					<Card variant="outlined" style={{ padding: 10 }}>
						<Box m={1} textAlign="center">
							<Button
								variant="contained"
								className={classes.button}
								size="small"
								color="primary"
								fullWidth={true}
								onClick={() => {
									setCircuitState(circuitStructure.getStoredCircuit());
									setEditorTouched(true);
								}}
							>
								{textContent.submissionControls.useCurrentCircuit}
							</Button>
						</Box>
						<Box m={1} textAlign="center">
							<Button
								onClick={handleTaskSave}
								variant="contained"
								color="primary"
								className={classes.button}
								size="small"
								startIcon={<SaveIcon />}
								fullWidth={true}
								disabled={!editorTouched}
							>
								{textContent.submissionControls.save}
							</Button>
						</Box>
						<Divider />
						<Box m={1} textAlign="center">
							<Button
								variant="contained"
								className={classes.button}
								size="small"
								component={Link}
								fullWidth={true}
								to="/student/tasks"
							>
								{textContent.submissionControls.back}
							</Button>
						</Box>
					</Card>
				</Box>
			</Box>
		);
	};

	return (
		<Grid container className={classes.root}>
			<Grid xs={2} component={Paper} item className={classes.taskControls}>
				{buildTaskControls()}
			</Grid>
			<Grid xs={10} item>
				<QuCircuit initialCircuit={submissionData.circuit} />
			</Grid>
			{toastState.open && buildToast()}
		</Grid>
	);
};

export default forwardRef(StudentTaskViewer);
