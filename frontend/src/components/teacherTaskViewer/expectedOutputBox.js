import React from "react";
import {Box, Button, Container, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

// TODO: Make the expected output actually take data from the task.
export default class ExpectedOutputBox extends React.Component {

    editButton() {
        return (
            <Box my={4} display="flex" flexDirection="center">
                {/* TODO: Send extra information to the teacherTaskEditor about the current circuit. */}
                <Button component={Link} to="/teacherTaskEditor" mr={4} variant="contained" color="primary">
                    Edit Expected Output
                </Button>
            </Box>
        );
    }

    render() {
        return (
            <Box>
                <Box textAlign="left" p={2}>
                    <Typography variant="h6">Expected</Typography>
                </Box>
                <Container>
                    <Box>
                        <Typography variant="body1">
                            &lt;1.0000+0.00000i|00&gt;
                        </Typography>
                    </Box>
                    {this.props.editable ? this.editButton() : null}
                </Container>
            </Box>
        );
    }
}