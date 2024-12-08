import {useContext} from 'react';
import Header from "../../components/Header";
import {Box, Grid2, Paper, Switch} from "@mui/material";
import './Settings.css';
import {getJson} from "../../lib/get";
import DebugContext from "../../contexts/debug";

function Settings() {
    const {debugRef} = useContext(DebugContext);
    return (
        <Paper>
            <Box>
                <Header isHome={false} subtitle="Workspace"/>
                <Box sx={{
                    p: 2,
                    height: "100vh",
                    overflowX: "hidden",
                    overflowY: "scroll",
                }}>
                    <Grid2 container>
                        <Grid2 item size={6}>
                            Debug?
                        </Grid2>
                        <Grid2 item size={6}>
                            <Switch
                                checked={debugRef.current}
                                onChange={() =>
                                    debugRef.current ?
                                        getJson("/debug/disable", debugRef.current) :
                                        getJson("/debug/enable", debugRef.current)
                            }
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </Box>
        </Paper>
    );
}

export default Settings;
