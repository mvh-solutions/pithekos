import PtksPage from "../../components/PtksPage";
import WorkspacePicker from "./WorkspacePicker";
import {Grid2, Paper} from "@mui/material";
import AddProjectButton from "./AddProjectButton";
import Cached from '@mui/icons-material/Cached';
import {useState, useEffect, useContext} from "react";
import {getJson} from "../../lib/get";
import DebugContext from "../../contexts/debug";
import I18nContext from "../../contexts/i18n";
// import {doI18n} from "../../lib/i18n";

function Home() {
    const [repos, setRepos] = useState([]);
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    const getRepoList = async () => {
        const response = await getJson("/git/list-local-repos", debugRef.current);
        if (response.ok) {
            setRepos(response.json);
        }
    }

    useEffect(
        () => {
            getRepoList();
        },
        []
    );

    return (
        <PtksPage
            isHome={true}
            subtitleKey="pages:home:subtitle"
            margin={0}
            widget={
                <Grid2 container>
                    <Grid2 item size={6}>
                        <Cached
                            id="reload-projects-button"
                            fontSize="large"
                            onClick={() => getRepoList()}
                            sx={{mr: 2}}
                        />
                    </Grid2>
                    <Grid2 item size={6}>
                        <AddProjectButton/>
                    </Grid2>
                </Grid2>
            }
        >
            {
                Object.keys(i18n).length === 0 ?
                    <p>...</p> :
                    <WorkspacePicker repos={repos}/>
            }
        </PtksPage>
    );
}

export default Home;
