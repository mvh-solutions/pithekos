import {useContext} from 'react';
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {debugContext as DebugContext, getJson} from "pithekos-lib";

function DeleteProjectButton({project}) {
    const {debugRef} = useContext(DebugContext);
    return (
        <IconButton
            aria-label="delete"
            onClick={
                async () => {
                    await getJson(`/git/delete-repo/${project}`, debugRef.current);
                    window.location.reload();
                }
            }
        >
            <DeleteIcon/>
        </IconButton>
    );
}

export default DeleteProjectButton;
