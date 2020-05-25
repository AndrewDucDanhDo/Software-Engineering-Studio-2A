import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	DialogContent,
	TextField,
	DialogActions,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";


export default function SaveCircuitModal(props) {
	const { onClose, open, onSubmit } = props;
	const [formState, setFormState] = React.useState({ circuitName: "" });

	const handleClose = () => {
		onClose();
	};

	const handleSubmit = () => {
		onSubmit(formState.circuitName);
	};

	const handleChange = (event) => {
		setFormState({ [event.target.id]: event.target.value });
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
		>
			<DialogTitle id="simple-dialog-title">Set a circuit name</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="circuitName"
					label="Circuit Name"
					type="text"
					fullWidth
					value={formState.circuitName}
					onChange={handleChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
