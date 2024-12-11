// import {useContext} from "react"
import PtksPage from "./components/PtksPage";
import DownloadProjectForm from "./DownloadProjectForm";
import {Grid2} from "@mui/material";
// import I18nContext from "../../contexts/i18n";
// import {doI18n} from "../../lib/i18n";

function DownloadProject() {
    // const i18n = useContext(I18nContext);
    return (
        <PtksPage
            isHome={false}
            subtitleKey="pages:download_project:subtitle"
        >
            <Grid2 container spacing={2}>
                <DownloadProjectForm/>
            </Grid2>
        </PtksPage>
    );
}

export default DownloadProject;
