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
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import api from "../../../helpers/api";
import { AuthContext } from "../../../context/auth";

export default function LoadCircuitModal(props) {
	const { onClose, open, onItemSelect } = props;
	const [circuitsState, setCircuitsState] = React.useState({
		circuits: undefined,
	});
	const { authState } = React.useContext(AuthContext);

	const fetchUserCircuits = async () => {
		// Fetch all the users circuits with await so that the
		// component will load before API the call finishes
		const res = await api.user.circuit.getAll(
			authState.user.idToken,
			authState.user.uid
		);

		setCircuitsState({ circuits: res.data.data.circuits });
	};

	React.useEffect(() => {
		if (circuitsState.circuits === undefined) {
			fetchUserCircuits();
		}
	}, []);

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
				{circuitsState.circuits === undefined ? (
					<CircularProgress />
				) : (
					<List>
						{circuitsState.circuits.map((circuit) => (
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
