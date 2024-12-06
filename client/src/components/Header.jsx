import {useEffect} from "react";
import {AppBar, Box, Icon, IconButton, Toolbar, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import '@fontsource/cardo/400.css';
import '@fontsource/cardo/700.css';
import {Public, PublicOff} from "@mui/icons-material";

function Header({isHome, subtitle, widget, enableNet, setEnableNet, enabledRef}) {
    const navigate = useNavigate();

    const netHandler = ev => {
        if (ev.data === "enabled" && !enabledRef.current) {
            setEnableNet(true);
        } else if (ev.data === "disabled" && enabledRef.current) {
            setEnableNet(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource("/notifications/net", {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                },
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        //console.log("Connected to net SSE");
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Error from net SSE", res.status);
                    }
                },
                onmessage(event) {
                    netHandler(event)
                },
                onclose() {
                    console.log("Net SSE connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from the net SSE server", err);
                },
            });
        };
        fetchData();
    }, []);

    return <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar sx={{backgroundColor: "#441650"}}>
                    <Icon size="large" sx={{mt: 1, mb: 1, width: "50pt", height: "50pt"}}>
                        <img alt="Pithekos logo" style={{width: 'inherit', height: 'inherit'}}
                             src="/client/favicon.svg"/>
                    </Icon>
                    <Typography
                        variant="h3"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontFamily: "cardo, serif",
                            fontWeight: "bold",
                            color: "#FFD5F6"
                        }}>
                        ίθηκος
                        {subtitle && subtitle.length > 0 &&
                            <Typography display="inline" variant="h5">{` — ${subtitle}`}</Typography>}
                    </Typography>
                    {widget &&
                        <Box sx={{flexGrow: 1}}>
                            {widget}
                        </Box>
                    }
                    <Box sx={{mr: "1em"}}>
                        {
                            enableNet ?
                                <Public
                                    onClick={
                                        () => {
                                            fetch(`/net/disable`);
                                        }
                                    }
                                    edge="start"
                                    fontSize="large"
                                    sx={{color: "#33FF33"}}
                                /> :
                                <PublicOff
                                    onClick={
                                        () => {
                                            fetch(`/net/enable`);
                                        }
                                    }
                                    edge="start"
                                    fontSize="large"
                                    sx={{color: "#AAAAAA"}}
                                />}
                    </Box>
                    {isHome && <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="settings"
                        sx={{mr: 2}}
                        onClick={() => navigate("/settings")}
                    >
                        <SettingsIcon fontSize="large"/>
                    </IconButton>
                    }
                    {!isHome && <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        sx={{mr: 2}}
                        onClick={() => navigate("/")}
                    >
                        <HomeIcon/>
                    </IconButton>
                    }
                </Toolbar>
            </AppBar>
        </Box>
}

export default Header;
