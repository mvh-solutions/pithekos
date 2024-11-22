import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Box, Paper} from "@mui/material";
import React from "react";

function Home() {
    return (
        <Paper>
            <Box>
                <Header isHome={true}/>
                <WorkspacePicker/>
            </Box>
        </Paper>
    );
}

export default Home;
