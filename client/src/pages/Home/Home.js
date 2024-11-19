import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Box, Paper} from "@mui/material";
import React from "react";

function Home({enableNet, setEnableNet}) {
    return (
        <Paper>
            <Box>
                <Header isHome={true} enableNet={enableNet}/>
                <WorkspacePicker enableNet={enableNet} setEnableNet={setEnableNet}/>
            </Box>
        </Paper>
    );
}

export default Home;
