import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Box, Paper} from "@mui/material";
import React from "react";

function Home({enableNet, setEnableNet, enabledRef}) {
    return (
        <Paper>
            <Box>
                <Header isHome={true} enableNet={enableNet} setEnableNet={setEnableNet} enabledRef={enabledRef}/>
                <WorkspacePicker enableNet={enableNet}/>
            </Box>
        </Paper>
    );
}

export default Home;
