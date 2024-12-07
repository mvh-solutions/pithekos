import Header from "../../components/Header";
import './NewProject.css';
import {Box, Paper, Grid2} from "@mui/material";

function NewProject({enableNet, setEnableNet, enabledRef}) {
    return (
        <Paper>
            <Box>
                <Header
                    isHome={false}
                    enableNet={enableNet}
                    setEnableNet={setEnableNet}
                    enabledRef={enabledRef}
                    subtitle="New Project"
                />
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <h1>New Project</h1>
                    </Grid2>
                </Grid2>
            </Box>
        </Paper>
    );
}

export default NewProject;
