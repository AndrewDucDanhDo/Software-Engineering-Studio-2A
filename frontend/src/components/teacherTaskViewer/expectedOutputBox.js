import React from "react";
import {Box, Button, Container, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class ExpectedOutputBox extends React.Component {

    editButton() {
        return (
            <Box my={4} display="flex" flexDirection="center">
                {/* TODO: Send extra information to the teacherEditor about the current circuit. */}
                <Button component={Link} to="/teacherEditor" mr={4} variant="contained" color="primary">
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