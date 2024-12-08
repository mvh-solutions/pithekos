import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Grid2, IconButton, TextField} from "@mui/material";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import NetContext from "../../contexts/net";
import DebugContext from "../../contexts/debug";
import {getJson} from "../../lib/get";

function DownloadProjectForm() {
    const [inputText, setInputText] = useState("");
    const navigate = useNavigate();
    const {enableNet} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    return <>
        <Grid2 size={10}>
            <TextField
                label="Github or Door3 URL"
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