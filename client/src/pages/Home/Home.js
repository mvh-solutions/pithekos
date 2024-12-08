import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Grid2, Paper} from "@mui/material";
import AddProjectButton from "./AddProjectButton";
import Cached from '@mui/icons-material/Cached';
import {useState, useEffect} from "react";

function Home() {
    const [repos, setRepos] = useState([]);
    const pollingFunc = async () => {
        const response = await fetch("/git/list-local-repos");
        setRepos(await response.json());
    }

    useEffect(
        () => {
            pollingFunc();
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
                                onClick={() => pollingFunc()}
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
