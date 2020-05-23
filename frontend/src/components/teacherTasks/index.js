import React from "react";
import {Link, withRouter} from "react-router-dom";
import {Box, Button, Container, Paper, Table, TableHead, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

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
                <TableCell style={{ width: '30%' }}>{data.title}</TableCell>
                <TableCell style={{ width: '70%' }}>{data.desc}</TableCell>
            </TableRow>
        );
    }

    render() {
        let sampleData = [
            { title: "Basic quantum circuit", desc: "Description text here"},
            { title: "Bell-state circuit", desc: "Description text here" },
            { title: "Quantum teleportation", desc: "Description text here" },
            { title: "A simple 8-bit adder", desc: "Description text here" },
            { title: "Test", desc: "Description text here" }
        ]

        return (
            <Container>
                <Box my={2} ml={4} textAlign="left">
                    <Typography variant="h4">Task List</Typography>
                </Box>

                {/* Right now, this is a table with example data. */}
                <Paper variant="outlined" style={{padding: 8, backgroundColor: "rgb(224, 233, 236)"}}>
                    <Table component={Paper} my={2} variant="outlined">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '30%' }}>Tasks</TableCell>
                                <TableCell style={{ width: '70%' }}>Description</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sampleData.map((data) => this.taskRow(data))}
                        </TableBody>
                    </Table>
                </Paper>

                <Box display="flex" flexDirection="row-reverse" my={2} mr={5}>
                    {/* TODO: Create a new task then redirect to teacherTaskEditor when button is clicked. */}
                    <Button component={Link} to="/teacherTaskEditor" variant="contained" color="primary">
                        Create New Task
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default withRouter(TeacherTasks);