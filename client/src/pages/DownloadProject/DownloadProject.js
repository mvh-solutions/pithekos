import {useContext} from "react"
import Header from "../../components/Header";
import DownloadProjectForm from "./DownloadProjectForm";
import './DownloadProject.css';
import {Box, Grid2, Paper} from "@mui/material";
import I18nContext from "../../contexts/i18n";
import {doI18n} from "../../lib/i18n";
import i18n from "../../contexts/i18n";

function DownloadProject() {
    const i18n = useContext(I18nContext);
    return (
        <Paper>
            <Box>
                <Header
                    isHome={false}
                    subtitle={doI18n("pages:download_project:subtitle", i18n)}
                    />
                <Grid2 container spacing={2}>
                    <DownloadProjectForm/>
                </Grid2>
            </Box>
        </Paper>
    );
}

export default DownloadProject;
