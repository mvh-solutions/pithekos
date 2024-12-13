import {useState, useContext} from 'react';
import {AppBar, Grid2, Icon, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import {Public, PublicOff} from "@mui/icons-material";
import {getJson} from "../lib/get";
import MessagesContext from "../contexts/messages";
import NetContext from "../contexts/net";
import DebugContext from "../contexts/debug";
import I18nContext from "../contexts/i18n";
import {doI18n} from "../lib/i18n";

function Header({isHome, subtitle, widget}) {
    const {messages, setMessages} = useContext(MessagesContext);
    const {enabledRef} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return <div sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{backgroundColor: "#441650"}}>
                <Grid2 container direction="row"
                       justifyContent="flex-end"
                       alignItems="center"
                       sx={{flexGrow: 1}}>
                    <Grid2 container size={{xs: 1}} justifyContent="flex-start">
                        <MenuIcon
                            onClick={e => setAnchorEl(e.currentTarget)}
                        />
                        <Menu
                            id="add-project-menu"
                            aria-labelledby="add-project-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={()=>setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={()=>{window.location.href = "/"}}>{doI18n("components:header:goto_local_projects_menu_item", i18n)}</MenuItem>
                        </Menu>
                    </Grid2>
                    <Grid2 container size={{xs: 5, md: 4, lg: 3}} justifyContent="flex-start">
                        {subtitle && subtitle.length > 0 && <Typography variant="h6">{doI18n(subtitle, i18n)}</Typography>}
                    </Grid2>
                    <Grid2 container size={{xs: 3, md: 4, lg: 6}} justifyContent="flex-start">
                        {widget}
                    </Grid2>
                    <Grid2 container size={{xs: 3, md: 2}} justifyContent="flex-end">
                        {
                            enabledRef.current ?
                                <Public
                                    onClick={
                                        async () => {
                                            const response = await getJson(`/net/disable`, debugRef.current);
                                            if (!response.ok) {
                                                setMessages([...messages, `warning--5--${response.url}--${response.status}`])
                                            }
                                        }
                                    }
                                    sx={{color: "#33FF33"}}
                                /> :
                                <PublicOff
                                    /*onClick={
                                        async () => {
                                            const response = await getJson(`/net/enable`, debugRef.current);
                                            if (!response.ok) {
                                                setMessages([...messages, `warning--5--${response.url}--${response.status}`])
                                            }
                                        }
                                    }*/
                                    sx={{color: "#AAAAAA"}}
                                />}
                        <SettingsIcon
                            color="inherit"
                            aria-label="settings"
                            sx={{ml: 2}}
                            //onClick={() => navigate("/settings")}
                        />
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    </div>
}

export default Header;
