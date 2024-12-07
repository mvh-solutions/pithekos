import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Box, Grid2, Paper} from "@mui/material";
import AddProjectButton from "./AddProjectButton";
import Cached from '@mui/icons-material/Cached';
import {useState, useEffect} from "react";

function Home({enableNet, setEnableNet, enabledRef}) {
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
            <Box>
                <Header
                    isHome={true}
                    subtitle="Local Projects"
                    enableNet={enableNet}
                    setEnableNet={setEnableNet}
                    enabledRef={enabledRef}
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
                                <AddProjectButton enableNet={enableNet}/>
                            </Grid2>
                        </Grid2>
                    }
                />
                <WorkspacePicker enableNet={enableNet} repos={repos} setRepos={setRepos}/>
            </Box>
        </Paper>
    );
}

export default Home;
