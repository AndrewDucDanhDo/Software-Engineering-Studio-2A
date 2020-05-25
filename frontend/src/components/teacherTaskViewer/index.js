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
} from "@material-ui/core";
import QuCircuit from "../quCircuit";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddOwnerModal from "./modal/addUser";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";
import Toast from "../Toast/toast";
import { useHistory } from "react-router-dom";
import { CircuitResultsContext } from "../../context/circuit";
import { CircuitStructureContext } from "../../context/circuit";
import { CircuitSetterContext } from "../../context/circuit";

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

const arrayToObject = (array, key) =>
	array.reduce((obj, item) => {
		obj[item[key]] = item;
		return obj;
	}, {});

const TeacherTaskViewer = (props) => {
	const { taskData, usersData, newTask } = props;
	const { authState } = React.useContext(AuthContext);
	const history = useHistory();
	const circuitResults = React.useContext(CircuitResultsContext);
	const circuitStructure = React.useContext(CircuitStructureContext);

	const teacherUsers = arrayToObject(
		usersData.filter(
			(user) => user.customClaims !== undefined && user.customClaims.teacher
		),
		"uid"
	);

	const studentUsers = arrayToObject(
		usersData.filter((user) => true),
		"uid"
	);

	const [taskState, setTaskState] = React.useState({
		name: taskData.name,
		description: taskData.description,
		summary: taskData.summary,
	});

	const [ownersState, setOwnersState] = React.useState({
		owners: taskData.owners.map((user) => teacherUsers[user]),
	});

	const [assignedState, setAssignedState] = React.useState({
		assigned: taskData.assigned.map((user) => studentUsers[user]),
	});

	const [expectedResultsState, setExpectedResultsState] = React.useState(
		taskData.expectedResults
	);
	const [circuitState, setCircuitState] = React.useState(
		taskData.masterCircuit
	);

	const [modalState, setModalState] = React.useState({ open: false });
	const [toastState, setToastState] = React.useState({ open: false });

	const handleTaskSave = async () => {
		const requestData = {
			name: taskState.name,
			summary: taskData.summary,
			masterCircuit: circuitState,
			description: taskState.description,
			expectedResults: expectedResultsState,
			owners: ownersState.owners.map((user) => user.uid),
			assigned: assignedState.assigned.map((user) => user.uid),
		};

		try {
			if (newTask) {
				await api.admin.tasks.create(authState.user.idToken, requestData);
				return setToastState({
					open: true,
					severity: "success",
					message: "Task successfully created.",
				});
			} else {
				await api.admin.tasks.update(
					authState.user.idToken,
					taskData.taskId,
					requestData
				);
				return setToastState({
					open: true,
					severity: "success",
					message: "Task successfully updated.",
				});
			}
		} catch (error) {
			return setToastState({
				open: true,
				severity: "error",
				message: "An unknown error occurred will trying to update task.",
			});
		}
	};

	const handleTaskDelete = async () => {
		try {
			await api.admin.tasks.delete(authState.user.idToken, taskData.taskId);
			setToastState({
				open: true,
				severity: "success",
				message: "Task successfully deleted",
			});
			return history.push(`/admin/tasks`);
		} catch (error) {
			return setToastState({
				open: true,
				severity: "error",
				message: "An unknown error occurred will trying to update task.",
			});
		}
	};

	const extrasBox = () => {
		return (
			<Card variant="outlined" style={{ padding: 20 }}>
				<Box textAlign="center">
					<Button
						variant="contained"
						style={{ fontSize: "10px" }}
						size="small"
						component={Link}
						to="/admin/tasks"
					>
						Back to tasks
					</Button>
				</Box>

				<Grid className="d-flex">
					<Box mt={2} textAlign="center">
						<Box mr={1} display="inline">
							<Button
								onClick={handleTaskSave}
								variant="contained"
								color="primary"
								style={{ fontSize: "10px" }}
								size="small"
								startIcon={<SaveIcon />}
							>
								Save
							</Button>
						</Box>

						<Box ml={0} display="inline">
							{!newTask && (
								<Button
									variant="contained"
									color="secondary"
									style={{ fontSize: "10px" }}
									size="small"
									startIcon={<DeleteIcon />}
									onClick={handleTaskDelete}
								>
									Delete
								</Button>
							)}
						</Box>
					</Box>
				</Grid>
			</Card>
		);
	};

	const buildOwnersPanel = () => {
		const adminDisplayName = teacherUsers[taskData.admin].displayName;

		const removeOwner = (uid) => {
			const newOwnerState = ownersState.owners.filter(
				(owner) => owner.uid !== uid
			);
			setOwnersState({ owners: newOwnerState });
		};

		return (
			<ExpansionPanel style={{ height: "50%" }}>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography variant="h6">Task Owners</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Box mx={1}>
						<Typography>Admin: {adminDisplayName}</Typography>
						<List dense>
							{ownersState.owners.map((user) => {
								return (
									<ListItem key={user.uid}>
										<ListItemText primary={user.displayName} />
										<ListItemSecondaryAction>
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => removeOwner(user.uid)}
											>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								);
							})}
						</List>
						<Button
							variant="contained"
							color="primary"
							style={{ fontSize: "10px" }}
							size="small"
							onClick={() =>
								setModalState({ open: true, type: "addTaskOwner" })
							}
						>
							Add task owner
						</Button>
					</Box>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	};

	const buildAssignedPanel = () => {
		const removeStudent = (uid) => {
			const newAssignedState = assignedState.assigned.filter(
				(assigned) => assigned.uid !== uid
			);
			setOwnersState({ assigned: newAssignedState });
		};

		return (
			<ExpansionPanel style={{ height: "50%" }}>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography variant="h6">Assigned Users</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Box mx={1}>
						<List dense>
							{assignedState.assigned.map((user) => {
								return (
									<ListItem key={user.uid}>
										<ListItemText primary={user.displayName} />
										<ListItemSecondaryAction>
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => removeStudent(user.uid)}
											>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								);
							})}
						</List>
						<Button
							variant="contained"
							color="primary"
							style={{ fontSize: "10px" }}
							size="small"
							onClick={() =>
								setModalState({ open: true, type: "addTaskStudent" })
							}
						>
							Add user
						</Button>
					</Box>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	};

	const buildModal = () => {
		const addOwner = (data) => {
			setModalState({ open: false });
			setOwnersState({ owners: [...ownersState.owners, data] });
		};

		const addAssigned = (data) => {
			setModalState({ open: false });
			setAssignedState({ assigned: [...assignedState.assigned, data] });
		};

		if (modalState.type === "addTaskOwner") {
			return (
				<AddOwnerModal
					msg="Select a teacher to add as an owner"
					open={modalState.open}
					onClose={() => {
						setModalState({ open: false });
					}}
					onItemSelect={addOwner}
					// Filter the available users to be added by the
					// ones that are currently in the owners list
					users={Object.values(teacherUsers).filter((user) => {
						return !ownersState.owners
							.map((user) => user.uid)
							.includes(user.uid);
					})}
				/>
			);
		} else if (modalState.type === "addTaskStudent") {
			return (
				<AddOwnerModal
					msg="Select a user to assign to the task"
					open={modalState.open}
					onClose={() => {
						setModalState({ open: false });
					}}
					onItemSelect={addAssigned}
					// Filter the available users to be added by the
					// ones that are currently in the owners list
					users={Object.values(studentUsers).filter((user) => {
						return !assignedState.assigned
							.map((user) => user.uid)
							.includes(user.uid);
					})}
				/>
			);
		}
	};

	const handleTaskOverviewChange = (event) => {
		const { id, value } = event.target;
		setTaskState({ ...taskState, [id]: value });
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
		return <QuCircuit defaultCircuit={taskData.masterCircuit} />;
	};

	const reduceAmplitude = (result) => {
		const [firstPart, secondPart] = result
			.replace("i", "")
			.split("+")
			.map((num) => parseFloat(num).toFixed(4));
		return `${firstPart}+${secondPart}i`;
	};

	return (
		<Grid
			container
			style={{ position: "absolute", width: "100%", height: "90%" }}
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
					<ExpansionPanel defaultExpanded={true} style={{ height: "50%" }}>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography variant="h6">Task Overview</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Box textAlign="center">
								<TextField
									id="name"
									label="Name"
									variant="outlined"
									size="small"
									margin="dense"
									fullWidth
									onChange={handleTaskOverviewChange}
									value={taskState.name}
								/>
								<TextField
									id="description"
									label="Description"
									variant="outlined"
									size="small"
									margin="dense"
									multiline
									rows={8}
									fullWidth
									type="text"
									onChange={handleTaskOverviewChange}
									value={taskState.description}
								/>
							</Box>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Box>
				<Box m={1}>{buildOwnersPanel()}</Box>
				<Box m={1}>{buildAssignedPanel()}</Box>
				<Box m={1}>
					<Box my={1}>
						<Card variant="outlined" style={{ padding: 8 }}>
							<Box>
								<Box m={2} textAlign="left">
									<Typography variant="h6">Expected Results</Typography>
								</Box>
								<Container>
									<Box textAlign="center">
										{expectedResultsState.map((result, index) => {
											const amp = reduceAmplitude(result.amplitude);
											const stat = result.state;
											const prob = result.probability;

											if (prob > 0) {
												return (
													<Typography
														variant="body1"
														style={{ fontSize: "14px" }}
														key={index}
													>
														{/* <1.00000000+0.00000000i|1.00000000+0.00000000i> 100% */}
														&lt;{`${amp}|${stat}`}&gt; {Math.floor(prob)}%
													</Typography>
												);
											}
										})}
									</Box>
									<Box m={2} textAlign="center">
										<Button
											variant="contained"
											style={{ fontSize: "10px" }}
											size="small"
											color="primary"
											onClick={() => {
												setExpectedResultsState(circuitResults);
												console.log(circuitStructure.getStoredCircuit());

												setCircuitState(circuitStructure.getStoredCircuit());
											}}
										>
											Set expected as current circuit result
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
				{buildSimulator()}
			</Grid>
			{/* Utility components that are displayed when needed */}
			{modalState.open && buildModal()}
			{toastState.open && buildToast()}
		</Grid>
	);
};

export default withStyles(styles)(TeacherTaskViewer);
