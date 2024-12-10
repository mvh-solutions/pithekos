// import {useContext} from "react";
import PtksPage from "../../components/PtksPage";
import {Grid2} from "@mui/material";
// import I18nContext from "../../contexts/i18n";
// import {doI18n} from "../../lib/i18n";

function NewProject() {
    // const i18n = useContext(I18nContext);
    return (
        <PtksPage
            isHome={false}
            subtitleKey="pages:new_project:subtitle"
        >
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <h1>New Project (stub content)</h1>
                </Grid2>
            </Grid2>
        </PtksPage>
    );
}

export default NewProject;
