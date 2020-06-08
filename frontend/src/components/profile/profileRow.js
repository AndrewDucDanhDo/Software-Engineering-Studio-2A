import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import RoundedButton from "../common/roundedButton";
import api from "../../helpers/api";
import { AuthContext } from "../../context/auth";

export default function ProfileRow(props) {
    const [value, setValue] = useState(props.userData[props.value]);
    const [editMode, setEditMode] = useState(false);
	const { authState } = React.useContext(AuthContext);

    function handleSave() {
        props.userData[props.value] = value;
        api.user.update(authState.user.idToken, authState.user.uid, props.userData);
        setEditMode(false);
    }

    function handleValueChange(event) {
        setValue(event.target.value)
    }

    const valueText = (
        <Box textAlign="left">
            <Typography variant="body1" >{value}</Typography>
        </Box>
    );
    const editableValueText = (<TextField fullWidth size="small" value={value} onChange={handleValueChange}/>)

    function editCell() {
        if (props.editable) {

            if (!editMode) {
                return (<RoundedButton variant="contained" onClick={() => setEditMode(true)}>Edit</RoundedButton>)
            } else {
                return (<RoundedButton variant="contained" onClick={handleSave}>Save</RoundedButton>)
            }
        }
        // Add an empty box so to help with position via flexbox.
        return (<Box></Box>);
    }

    return (
        <Box className={props.className} display="flex" flexDirection="row" px={2} justify="space-between" alignItems="center">
            <Box flex={2} textAlign="left">
                <Typography variant="caption">{props.title}</Typography>
            </Box>
            <Box flex={4}>
                {editMode ? editableValueText : valueText}
            </Box>
            <Box flex={1}>
                {editCell()}
            </Box>
        </Box>
    )
}