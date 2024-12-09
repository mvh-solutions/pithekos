import {useContext} from 'react';
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {getJson} from "../../lib/get";
import DebugContext from "../../contexts/debug";

function DeleteProjectButton({project}) {
    const {debugRef} = useContext(DebugContext);
    return (
        <IconButton
            aria-label="delete"
            onClick={
                () => {
                    getJson(`/git/delete-repo/${project}`, debugRef.current)
                }
            }
        >
            <DeleteIcon/>
        </IconButton>
    );
}

export default DeleteProjectButton;
