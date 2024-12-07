import Header from '../../components/Header';
import WorkspacePicker from "./WorkspacePicker";
import {Box, Paper} from "@mui/material";
import AddProjectButton from "./AddProjectButton";

function Home({enableNet, setEnableNet, enabledRef}) {
    return (
        <Paper>
            <Box>
                <Header
                    isHome={true}
                    subtitle="Local Projects"
                    enableNet={enableNet}
                    setEnableNet={setEnableNet}
                    enabledRef={enabledRef}
                    widget={<AddProjectButton enableNet={enableNet}/>}
                />
                <WorkspacePicker enableNet={enableNet}/>
            </Box>
        </Paper>
    );
}

export default Home;
