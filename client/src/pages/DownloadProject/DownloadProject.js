import Header from "../../components/Header";
import DownloadProjectForm from "../Home/DownloadProjectForm";
import './DownloadProject.css';
import {Box, Grid2, Paper} from "@mui/material";

function DownloadProject({enableNet, setEnableNet, enabledRef}) {
    return (
        <Paper>
            <Box>
                <Header
                    isHome={false}
                    subtitle="Download Project"
                    enableNet={enableNet}
                    setEnableNet={setEnableNet}
                    enabledRef={enabledRef}/>
                <Grid2 container spacing={2}>
                    <DownloadProjectForm enableNet={enableNet}/>
                </Grid2>
            </Box>
        </Paper>
    );
}

export default DownloadProject;
