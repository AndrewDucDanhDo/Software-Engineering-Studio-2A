import React from "react";
import {Link, withRouter} from "react-router-dom";
import {Box, Button, Container, Paper, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

class TeacherTasks extends React.Component {

    constructor(props) {
        super(props);

        this.handleRowSelect = this.handleRowSelect.bind(this);
    }

    handleRowSelect(event) {
        console.log(JSON.stringify(this.props))
        // TODO: Send extra information about the task to the teacherTaskViewer.
        this.props.history.push("/teacherTaskViewer")
    }

    taskRow(data) {
        return (
            <TableRow hover onClick={this.handleRowSelect}>
                <TableCell>{data.title}</TableCell>
            </TableRow>
        );
    }

    render() {
        let sampleData = [
            { title: "Basic quantum circuit"},
            { title:"Bell-state circuit"},
            { title:"Quantum teleportation"},
            { title:"A simple 8-bit adder"},
        ]

        return (
            <Container>
                <Box my={2} ml={4} textAlign="left">
                    <Typography variant="h4">Tasks</Typography>
                </Box>

                {/* Right now, this is a table with example data. */}
                <Paper variant="outlined" style={{padding: 8, backgroundColor: "rgb(255, 81, 81)"}}>
                    <Table component={Paper} my={2} variant="outlined">
                        <TableBody>
                            {sampleData.map((data) => this.taskRow(data))}
                        </TableBody>
                    </Table>
                </Paper>

                <Box display="flex" flexDirection="row-reverse" my={2} mr={5}>
                    {/* TODO: Create a new task then redirect to teacherTaskEditor when button is clicked. */}
                    <Button component={Link} to="/teacherTaskEditor" variant="contained" color="primary">
                        New Task
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default withRouter(TeacherTasks);