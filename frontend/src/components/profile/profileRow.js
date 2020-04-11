import React from "react";
import {Button, TableCell, TableRow, TextField, Typography} from "@material-ui/core";

export default class ProfileRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isEditMode: false,
            value: this.props.value
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleEdit() {
        this.setState({
            isEditMode: true
        });
    }

    handleSave() {
        // TODO: Upload the new data towards the backend here.

        this.setState({
            isEditMode: false
        });
    }

    handleValueChange(event) {
        this.setState({value: event.target.value})
    }

    getText() {
        return (<Typography variant="body1" >{this.state.value}</Typography>)
    }

    getEditableText() {
        return (<TextField fullWidth size="small" value={this.state.value} onChange={this.handleValueChange}/>)
    }

    getEditCell() {
        if (this.props.editable) {

            if (!this.state.isEditMode) {
                return (<Button variant="contained" onClick={this.handleEdit}>Edit</Button>)
            } else {
                return (<Button variant="contained" onClick={this.handleSave}>Save</Button>)
            }
        }
        return null;
    }

    render() {
        return (
            <TableRow>
                <TableCell align="left" size="small">
                    <Typography variant="caption">{this.props.title}</Typography>
                </TableCell>
                <TableCell align="left">
                    {this.state.isEditMode ? this.getEditableText() : this.getText()}
                </TableCell>
                <TableCell align="right">
                    {this.getEditCell()}
                </TableCell>
            </TableRow>
        )
    }
}