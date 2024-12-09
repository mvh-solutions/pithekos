import React, {useState, useContext} from "react";
import {Menu, MenuItem} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import {useNavigate} from "react-router-dom";
import NetContext from "../../contexts/net";
import I18nContext from "../../contexts/i18n";
import {doI18n} from "../../lib/i18n";

function AddProjectButton() {
    const i18n = useContext(I18nContext);
    const navigate = useNavigate();
    const {enableNet} = useContext(NetContext);
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
                <MenuItem onClick={handleNewProject}>{doI18n("pages:home:new_project_menu_item", i18n)}</MenuItem>
                <MenuItem onClick={handleDownloadProject} disabled={!enableNet}>{doI18n("pages:home:download_project_menu_item", i18n)}</MenuItem>
            </Menu>
        </div>
    );
}

export default AddProjectButton;