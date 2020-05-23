import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Toast(props) {
	const [open, setOpen] = React.useState(true);
	const { severity, message, onClose } = props;

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
		onClose();
	};

	return (
		<Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
			<Alert onClose={handleClose} severity={severity}>
				{message}
			</Alert>
		</Snackbar>
	);
}
