import React, {useState, useContext} from "react";
import {Grid2, IconButton, TextField} from "@mui/material";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import NetContext from "../framework/contexts/net";
import DebugContext from "../framework/contexts/debug";
import {getJson} from "../framework/lib/get";
import I18nContext from "../framework/contexts/i18n";
import {doI18n} from "../framework/lib/i18n";

function DownloadProjectForm() {
    const [inputText, setInputText] = useState("");
    const {enableNet} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    return <>
        <Grid2 size={10}>
            <TextField
                label={doI18n("pages:download_project:url_prompt", i18n)}
                fullWidth
                variant="filled"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
            />
        </Grid2>
        <Grid2 size={2}>
            <IconButton
                disabled={!enableNet}
                onClick={
                    async () => {
                        await getJson(
                            `/git/fetch-repo/${inputText.replace(/^https?:\/\//, "")}`,
                            debugRef
                        );
                        window.location.href = "/";
                    }
                }
            >
                <DownloadForOfflineIcon/>
            </IconButton>
        </Grid2>
    </>
}

export default DownloadProjectForm;