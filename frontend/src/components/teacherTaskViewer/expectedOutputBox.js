import React from "react";
import { Box, Button, Container, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

// TODO: Make the expected output actually take data from the task.
export default function ExpectedOutputBox(props) {

    function EditButton() {
        return (
            <Box m={2} textAlign="center">
                {/* TODO: Send extra information to the teacherTaskEditor about the current circuit. */}
                <Button component={Link} to="/teacherTaskEditor" variant="contained" style={{ fontSize: '10px' }} size="small" color="primary" >
                    Edit
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box m={2} textAlign="left">
                <Typography variant="h6">Expected</Typography>
            </Box>
            <Container>
                <Box textAlign="center">
                    <Typography variant="body1" style={{ fontSize: '14px' }}>
                        &lt;1.0000+0.00000i|00&gt;
                    </Typography>
                </Box >
                {props.editable ? <EditButton/> : null}
            </Container>
        </Box>
    );
}