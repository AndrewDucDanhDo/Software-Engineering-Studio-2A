import React from "react";
import { Link } from "react-router-dom";
import {
	Box,
	TextField,
	Button,
	Grid,
	Paper,
	Typography,
	Card,
} from "@material-ui/core";
import ExpectedOutputBox from "../teacherTaskViewer/expectedOutputBox";
import QuCircuit from "../quCircuit";

export default class TeacherTaskEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			task: {
				name: "",
				desc: "",
			},
			errors: {},
		};
	}

	teacherTaskEditorIsValid() {
		var taskIsValid = true;
		this.setState({
			errors: {},
		});

		if (this.state.task.name === "") {
			Object.assign(this.state, {
				errors: Object.assign(this.state.errors, {
					name: "Task name is required",
				}),
			});
			taskIsValid = false;
		}

		if (this.state.task.desc === "") {
			Object.assign(this.state, {
				errors: Object.assign(this.state.errors, {
					desc: "Task description is required",
				}),
			});
			taskIsValid = false;
		}
		return taskIsValid;
	}

	render() {
		return (
			<Grid
				container
				style={{ position: "absolute", width: "100%", height: "90%" }}
			>
				<Grid
					xs={2}
					item
					component={Paper}
					style={{
						backgroundColor: "#f7f7f7",
						height: "93.5%",
						overflow: "scroll",
					}}
				>
					<Box m={2}>
						<Card variant="outlined" style={{ padding: 8 }}>
							<ExpectedOutputBox />

							<Box m={2} textAlign="center">
								<Button
									variant="contained"
									style={{ fontSize: "10px" }}
									color="primary"
								>
									Set Output
								</Button>
							</Box>
						</Card>
					</Box>

					<Box m={2}>
						<Card variant="outlined" style={{ padding: 8 }}>
							<Box my={2} textAlign="center">
								<Button
									component={Link}
									to="/teacherTaskViewer"
									variant="contained"
									style={{ fontSize: "10px" }}
									size="small"
									color="default"
								>
									Back to Viewer
								</Button>
							</Box>
						</Card>
					</Box>
				</Grid>
				<Grid xs={10} item>
					<QuCircuit />
				</Grid>
			</Grid>
		);
	}
}
