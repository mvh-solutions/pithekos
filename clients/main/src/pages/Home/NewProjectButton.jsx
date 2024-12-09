import {useNavigate} from "react-router-dom";
import {IconButton} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function NewProjectButton() {
    const navigate = useNavigate();
    return (
        <IconButton
            size="large"
            disabled={true}
            onClick={() => navigate("/new-project")}>
            <AddCircleIcon fontSize="large"/>
        </IconButton>
    );
}

export default NewProjectButton;
