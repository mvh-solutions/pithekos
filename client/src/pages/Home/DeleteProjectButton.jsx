import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function DeleteProjectButton({project}) {
    return (
                <IconButton aria-label="delete"
                    onClick={() =>
                        fetch(`/git/delete-repo/${project}`)
                }
                >
                    <DeleteIcon/>
                </IconButton>
    );
}

export default DeleteProjectButton;
