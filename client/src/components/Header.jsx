import {useContext} from 'react';
import {AppBar, Grid2, Icon, Toolbar, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";
import {Public, PublicOff} from "@mui/icons-material";
import {getJson} from "../lib/get";
import MessagesContext from "../contexts/messages";
import NetContext from "../contexts/net";
import DebugContext from "../contexts/debug";
function Header({isHome, subtitle, widget}) {
    const navigate = useNavigate();
    const {messages, setMessages} = useContext(MessagesContext);
    const {enabledRef} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    return <div sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{backgroundColor: "#441650"}}>
                <Grid2 container direction="row"
                       justifyContent="flex-end"
                       alignItems="center"
                       sx={{flexGrow: 1}}>
                    <Grid2 container size={{xs: 1}} justifyContent="flex-start">
                        <Icon size="large" sx={{mt: 1, mb: 1, width: "50pt", height: "50pt"}}>
                            <img alt="Pithekos logo" style={{width: 'inherit', height: 'inherit'}}
                                 src="/client/favicon.svg"/>
                        </Icon>
                    </Grid2>
                    <Grid2 container size={{xs: 5, md: 4, lg: 2}} justifyContent="flex-start">
                        {!isHome &&
                        <BackIcon
                            fontSize="large"
                            color="inherit"
                            aria-label="settings"
                            sx={{mr: 2}}
                            onClick={() => navigate("/")}
                        />}
                        {subtitle && subtitle.length > 0 && <Typography variant="h5">{subtitle}</Typography>}
                    </Grid2>
                    <Grid2 container size={{xs: 4, md: 6, lg: 8}} justifyContent="flex-start">
                        {widget}
                    </Grid2>
                    <Grid2 container size={{xs: 2, md: 1}} justifyContent="flex-end">
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
                                    fontSize="large"
                                    sx={{color: "#33FF33"}}
                                /> :
                                <PublicOff
                                    onClick={
                                        async () => {
                                            const response = await getJson(`/net/enable`, debugRef.current);
                                            if (!response.ok) {
                                                setMessages([...messages, `warning--5--${response.url}--${response.status}`])
                                            }
                                        }
                                    }
                                    fontSize="large"
                                    sx={{color: "#AAAAAA"}}
                                />}
                        <SettingsIcon
                            fontSize="large"
                            color="inherit"
                            aria-label="settings"
                            sx={{ml: 2}}
                            onClick={() => navigate("/settings")}
                        />
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    </div>
}

export default Header;
