import {useContext} from "react";
import Header from "../../components/Header";
import './NewProject.css';
import {Box, Paper, Grid2} from "@mui/material";
import I18nContext from "../../contexts/i18n";
import {doI18n} from "../../lib/i18n";

function NewProject() {
    const i18n = useContext(I18nContext);
    return (
        <Paper>
            <Box>
                <Header
                    isHome={false}
                    subtitle={doI18n("pages:new_project:subtitle", i18n)}
                />
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <h1>New Project (stub content)</h1>
                    </Grid2>
                </Grid2>
            </Box>
        </Paper>
    );
}

export default NewProject;
