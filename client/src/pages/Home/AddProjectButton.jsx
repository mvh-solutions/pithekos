import React, {useState} from "react";
import {Menu, MenuItem} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import {useNavigate} from "react-router-dom";

function AddProjectButton({enableNet}) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNewProject = () => {
        navigate("/new-project");
    };

    const handleDownloadProject = () => {
        navigate("/download-project");
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <AddCircleIcon
                id="add-project-button"
                aria-controls={open ? 'add-project-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                fontSize="large"
            />
            <Menu
                id="add-project-menu"
                aria-labelledby="add-project-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleNewProject}>Create New Local Project</MenuItem>
                <MenuItem onClick={handleDownloadProject} disabled={!enableNet}>Download Remote Project</MenuItem>
            </Menu>
        </div>
    );
}

export default AddProjectButton;