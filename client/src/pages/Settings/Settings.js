import Header from "../../components/Header";
import './Settings.css';
import {Box, Paper, Typography} from "@mui/material";

function Settings({enableNet, setEnableNet, enabledRef}) {
    return (
        <Paper>
            <Box>
            <Header isHome={false} enableNet={enableNet} setEnableNet={setEnableNet} enabledRef={enabledRef}/>
                <Typography variant="h6">Settings</Typography>
            </Box>
        </Paper>
    );
}

export default Settings;
