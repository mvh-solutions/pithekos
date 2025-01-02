import {useState, useEffect} from "react"
import {Grid2} from "@mui/material";
import {CloudDownload, CloudDone} from "@mui/icons-material";
import {getAndSetJson, getJson} from "pithekos-lib";

function App() {
    const [catalog, setCatalog] = useState([]);
    useEffect(
        () => {getAndSetJson({
                url: "/gitea/remote-repos/git.door43.org/BurritoTruck",
                setter: setCatalog
            }).then()},
        []
    );

    const [localRepos, setLocalRepos] = useState([]);
    useEffect(
        () => {getAndSetJson({
                url: "/git/list-local-repos",
                setter: setLocalRepos
            }).then()},
        []
    );

    return (
        <Grid2 container spacing={2}>
            <Grid2 container>
                {
                    catalog
                        .filter(ce => ce.flavor)
                        .map(
                            ce => {
                                const remoteRepoPath = `git.door43.org/BurritoTruck/${ce.name}`;
                                return <>
                                    <Grid2 item size={1}>
                                        {ce.abbreviation.toUpperCase()}
                                    </Grid2>
                                    <Grid2 item size={1}>
                                        {ce.language_code}
                                    </Grid2>
                                    <Grid2 item size={6}>
                                        {ce.description}
                                    </Grid2>
                                    <Grid2 item size={3}>
                                        {`${ce.flavor_type}/${ce.flavor}`}
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
    );
}

export default App;
