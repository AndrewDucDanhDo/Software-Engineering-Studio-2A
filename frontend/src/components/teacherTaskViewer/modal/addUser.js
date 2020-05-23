import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	DialogContent,
	Dialog,
	DialogActions,
	List,
	ListItem,
	ListItemText,
} from "@material-ui/core";

export default function AddUsersModal(props) {
	const { onClose, open, onItemSelect, users, msg } = props;

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
		>
			<DialogTitle id="simple-dialog-title">{msg}</DialogTitle>
			<DialogContent>
				<List>
					{Object.values(users).map((user) => (
						<ListItem button onClick={() => onItemSelect(user)} key={user.uid}>
							<ListItemText primary={user.displayName} />
						</ListItem>
					))}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
