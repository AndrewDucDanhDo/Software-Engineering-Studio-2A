import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	DialogContent,
	Dialog,
	DialogActions,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	makeStyles,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
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

export default function LoadCircuitModal(props) {
	const classes = withStyles();
	const { onClose, open, onItemSelect } = props;
	const [circuitsState, setCircuitsState] = React.useState(undefined);
	const { authState } = React.useContext(AuthContext);
	const [isLoading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchUserCircuits = async () => {
			// Fetch all the users circuits with await so that the
			// component will load before API the call finishes
			const res = await api.user.circuit.getAll(
				authState.user.idToken,
				authState.user.uid
			);
			setCircuitsState(res.data.data.circuits);
			setLoading(false);
		};

		if (circuitsState === undefined) fetchUserCircuits();
	});

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
		>
			<DialogTitle id="simple-dialog-title">
				Select a circuit to load
			</DialogTitle>
			<DialogContent>
				{isLoading ? (
					<CircularProgress className={classes.spinner} />
				) : circuitsState.length > 0 ? (
					<List>
						{circuitsState.map((circuit) => (
							<ListItem
								button
								onClick={() => onItemSelect(circuit, "SELECT")}
								key={circuit.circuitId}
							>
								<ListItemText primary={circuit.circuitId} />
								<ListItemSecondaryAction>
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => onItemSelect(circuit, "DELETE")}
									>
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				) : (
					<p>No saved circuits found.</p>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
