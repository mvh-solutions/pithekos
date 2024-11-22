import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Grid2, IconButton, TextField} from "@mui/material";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { NetContext } from "../../contexts/NetContext";

function DownloadProjectForm() {
    const {enableNet} = useContext(NetContext);
    const [inputText, setInputText] = useState("");
    const navigate = useNavigate();
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
                        fetch(`/git/fetch-repo/${inputText.replace(/^https?:\/\//, "")}`);
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