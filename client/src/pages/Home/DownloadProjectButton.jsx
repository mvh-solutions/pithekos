import {useNavigate} from "react-router-dom";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {IconButton} from "@mui/material";
function DownloadProjectButton({enabled}) {
    const navigate = useNavigate();
    return (
                <IconButton
                    size="large"
                    onClick={() => navigate("/download-project")}
                    disabled={!enabled}
                >
                    <CloudDownloadIcon fontSize="large"/>
                </IconButton>
    );
}

export default DownloadProjectButton;
