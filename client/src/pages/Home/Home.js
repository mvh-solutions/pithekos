import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Grid2, Paper} from "@mui/material";
import AddProjectButton from "./AddProjectButton";
import Cached from '@mui/icons-material/Cached';
import {useState, useEffect, useContext} from "react";
import {getJson} from "../../lib/get";
import DebugContext from "../../contexts/debug";

function Home() {
    const [repos, setRepos] = useState([]);
    const {debugRef} = useContext(DebugContext);
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
        <Paper>
            <Header
                isHome={true}
                subtitle="Local Projects"
                widget={
                    <Grid2 container>
                        <Grid2 item size={6}>
                            <Cached
                                id="reload-projects-button"
                                fontSize="large"
                                onClick={() => getRepoList()}
                            />
                        </Grid2>
                        <Grid2 item size={6}>
                            <AddProjectButton/>
                        </Grid2>
                    </Grid2>
                }
            />
            <WorkspacePicker repos={repos}/>
        </Paper>
    );
}

export default Home;
