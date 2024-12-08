import Header from "../../components/Header";
import './Settings.css';
import {Box, Paper, Typography} from "@mui/material";

function Settings() {
    return (
        <Paper>
            <Box>
            <Header isHome={false}/>
                <Typography variant="h6">Settings</Typography>
            </Box>
        </Paper>
    );
}

export default Settings;
