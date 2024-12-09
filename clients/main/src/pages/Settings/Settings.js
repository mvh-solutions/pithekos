import {useContext} from 'react';
import Header from "../../components/Header";
import {Box, Grid2, Paper, Switch} from "@mui/material";
import './Settings.css';
import {getJson} from "../../lib/get";
import DebugContext from "../../contexts/debug";
import I18nContext from "../../contexts/i18n";
import {doI18n} from "../../lib/i18n";

function Settings() {
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    return (
        <Paper>
            <Box>
                <Header isHome={false} subtitle={doI18n("pages:settings:subtitle", i18n)}/>
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
