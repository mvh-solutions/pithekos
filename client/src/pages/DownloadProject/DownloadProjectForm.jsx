import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Grid2, IconButton, TextField} from "@mui/material";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import NetContext from "../../contexts/net";
import DebugContext from "../../contexts/debug";
import {getJson} from "../../lib/get";
import I18nContext from "../../contexts/i18n";
import {doI18n} from "../../lib/i18n";

function DownloadProjectForm() {
    const [inputText, setInputText] = useState("");
    const navigate = useNavigate();
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
                    () => {
                        getJson(
                            `/git/fetch-repo/${inputText.replace(/^https?:\/\//, "")}`,
                            debugRef
                        );
                        navigate("/");
                    }
                }
            >
                <DownloadForOfflineIcon/>
            </IconButton>
        </Grid2>
    </>
}

export default DownloadProjectForm;