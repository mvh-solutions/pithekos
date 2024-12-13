import {useState, useEffect} from "react"
import PtksPage from "./components/PtksPage";
import {Grid2} from "@mui/material";
import {CloudDownload, CloudDone} from "@mui/icons-material";
// import I18nContext from "../../contexts/i18n";
// import {doI18n} from "../../lib/i18n";
import {getJson} from "./lib/get";

function DownloadProject() {
    const [catalog, setCatalog] = useState([]);
    const [localRepos, setLocalRepos] = useState([]);
    // const i18n = useContext(I18nContext);

    useEffect(
        async () => {
            const catalogResponse = await getJson("/gitea/remote-repos/git.door43.org/BurritoTruck");
            if (catalogResponse.ok) {
                setCatalog(catalogResponse.json);
            }
        },
        []
    );

    useEffect(
        async () => {
            const localReposResponse = await getJson("/git/list-local-repos");
            if (localReposResponse.ok) {
                setLocalRepos(localReposResponse.json);
            }
        },
        []
    );

    return (
        <PtksPage
            isHome={false}
            subtitleKey="pages:download_project:subtitle"
            requireNet={true}
        >
            <Grid2 container spacing={2}>
                <Grid2 container>
                    {
                        catalog
                            .filter(ce => ce.flavor)
                            .map(
                                ce => {
                                    const remoteRepoPath = `git.door43.org/BurritoTruck/${ce.name}`;
                                    console.log(remoteRepoPath, localRepos);
                                    return <>
                                        <Grid2 item size={2}>
                                            {ce.abbreviation.toUpperCase()}
                                        </Grid2>
                                        <Grid2 item size={1}>
                                            {ce.language_code}
                                        </Grid2>
                                        <Grid2 item size={6}>
                                            {ce.description}
                                        </Grid2>
                                        <Grid2 item size={2}>
                                            {`${ce.flavor}/${ce.flavor_type}`}
                                        </Grid2>
                                        <Grid2 item size={1}>
                                            {
                                                localRepos.includes(remoteRepoPath) ?
                                                    <CloudDone color="disabled"/> :
                                                    <CloudDownload
                                                        disabled={localRepos.includes(remoteRepoPath)}
                                                        onClick={async () => {
                                                            await getJson(`/git/fetch-repo/${remoteRepoPath}`);
                                                            window.location.href = "/";
                                                        }}
                                                    />
                                            }
                                        </Grid2>
                                    </>
                                }
                            )
                    }
                </Grid2>
            </Grid2>
        </PtksPage>
    );
}

export default DownloadProject;
