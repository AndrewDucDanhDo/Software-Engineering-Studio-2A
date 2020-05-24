import React from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Button,
	Card,
	Grid,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	TextField,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	withStyles,
} from "@material-ui/core";
import ExpectedOutputBox from "./expectedOutputBox";
import QuantumSimulator from "../quantum";
import axios from 'axios';
import api from "../../helpers/api";

import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";

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

export class TeacherTaskViewer extends React.Component {
	permissionRow(data) {
		return (
			<TableRow hover onClick={() => {}}>
				<TableCell>
					<Box>
						<Typography
							variant="body2"
							style={{ userSelect: "none", fontSize: "14px" }}
						>
							{data.name}
						</Typography>
					</Box>
				</TableCell>
				<TableCell>
					<IconButton hover onClick={() => {}} size="small">
						<DeleteIcon fontSize="small" />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}

	submissionRow(data) {
		return (
			<TableRow hover onClick={() => {}}>
				<TableCell style={{ width: "30%" }}>
					<Box>
						<Typography
							variant="body2"
							style={{ userSelect: "none", fontSize: "14px" }}
						>
							{data.name}
						</Typography>
					</Box>
				</TableCell>
				<TableCell align="center" style={{ width: "50%" }}>
					<RemoveCircleOutlineIcon
						color="secondary"
						style={{ width: 20, height: 20 }}
					/>
				</TableCell>
			</TableRow>
		);
	}

	expectedBox() {}

	extrasBox() {
		return (
			<Card variant="outlined" style={{ padding: 20 }}>
				<Box textAlign="center">
					<Button
						variant="contained"
						style={{ fontSize: "10px" }}
						size="small"
						component={Link}
						to="/teacherTasks"
					>
						Back to tasks
					</Button>
				</Box>

				<Grid className="d-flex">
					<Box mt={2} textAlign="center">
						<Box mr={1} display="inline">
							<Button
								onClick={() => {
									console.log("onClick");
								}}
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
							<Button
								variant="contained"
								color="secondary"
								style={{ fontSize: "10px" }}
								size="small"
								startIcon={<DeleteIcon />}
							>
								Delete
							</Button>
						</Box>
					</Box>
				</Grid>
			</Card>
		);
    }
    
    async componentDidMount() {
		const { idToken, taskid } = this.context.authState.user;
		const userData = (await api.user.get(idToken, uid)).data.data;
        this.setState({ userData });
        console.log('Data fetched');
	}

	render() {
		let sampleTeacherData = [
			{ name: "John" },
			{ name: "David" },
			{ name: "Bruce" },
			{ name: "William" },
			{ name: "Ned" },
		];

		let sampleSubmissionData = [
			{ name: "John" },
			{ name: "David" },
			{ name: "Bruce" },
			{ name: "William" },
			{ name: "Ned" },
		];

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
						<ExpansionPanel style={{ height: "50%" }}>
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
									/>

									<TextField
										id="desc"
										label="Description"
										variant="outlined"
										size="small"
										margin="dense"
										multiline
										rows={8}
										fullWidth
									/>
								</Box>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Box>

					<Box m={1}>
						<ExpansionPanel style={{ height: "50%" }}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography variant="h6">Permissions</Typography>
							</ExpansionPanelSummary>

							<Box mx={3}>
								<TextField
									id="Search"
									label="Search"
									type="search"
									variant="filled"
									size="small"
									margin="dense"
								/>
							</Box>

							<ExpansionPanelDetails>
								<Box mx={1}>
									<Table
										component={Paper}
										variant="scrollable"
										size="small"
										style={{ overflow: "style" }}
									>
										<TableHead>
											<TableRow color="primary">
												<TableCell>Teachers</TableCell>
												<TableCell />
											</TableRow>
										</TableHead>
										<TableBody>
											{sampleTeacherData.map((data) =>
												this.permissionRow(data)
											)}
										</TableBody>
									</Table>
								</Box>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Box>

					<Box m={1}>
						<ExpansionPanel style={{ height: "50%" }}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography variant="h6">Assign Task</Typography>
							</ExpansionPanelSummary>

							<Box mx={3} textAlign="center">
								<TextField
									id="Search"
									label="Search"
									type="search"
									variant="filled"
									size="small"
									margin="dense"
								/>
							</Box>

							<ExpansionPanelDetails>
								<Table component={Paper} variant="scrollable" size="small">
									<Box textAlign="center">
										<TableHead>
											<TableRow>
												<TableCell>Students</TableCell>
												<TableCell>Submission</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											{sampleSubmissionData.map((data) =>
												this.submissionRow(data)
											)}
										</TableBody>
									</Box>
								</Table>
							</ExpansionPanelDetails>
						</ExpansionPanel>

						<Box my={1}>
							<Card variant="outlined" style={{ padding: 8 }}>
								<ExpectedOutputBox editable />
							</Card>
						</Box>

						<Box my={1}>{this.extrasBox()}</Box>
					</Box>
				</Grid>

				<Grid xs={10} item>
					<QuantumSimulator />
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles)(TeacherTaskViewer);
