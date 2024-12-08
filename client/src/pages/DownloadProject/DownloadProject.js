import Header from "../../components/Header";
import DownloadProjectForm from "../Home/DownloadProjectForm";
import './DownloadProject.css';
import {Box, Grid2, Paper} from "@mui/material";

function DownloadProject() {
    return (
        <Paper>
            <Box>
                <Header
                    isHome={false}
                    subtitle="Download Project"
                    />
                <Grid2 container spacing={2}>
                    <DownloadProjectForm/>
                </Grid2>
            </Box>
        </Paper>
    );
}

export default DownloadProject;
