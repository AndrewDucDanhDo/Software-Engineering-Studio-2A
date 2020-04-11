import React from "react";
import {Box, Typography} from "@material-ui/core";
import Profile from "../../components/profile";

export default class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box>
                <Profile />
            </Box>
        )
    }
}