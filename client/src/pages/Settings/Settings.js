import Header from "../../components/Header";
import './Settings.css';
import {Box, Paper, Typography} from "@mui/material";

function Settings({enableNet, setEnableNet}) {
    return (
        <Paper>
            <Box>
            <Header isHome={false} enableNet={enableNet} setEnableNet={setEnableNet}/>
                <Typography variant="h6">Settings</Typography>
            </Box>
        </Paper>
    );
}

export default Settings;
