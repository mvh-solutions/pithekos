import {useEffect, useRef, useContext} from "react";
import {AppBar, Box, Icon, IconButton, Toolbar, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom";
import '@fontsource/cardo/400.css';
import '@fontsource/cardo/700.css';
import {Cloud, CloudOff} from "@mui/icons-material";
import { NetContext } from "../contexts/NetContext";
import React from "react";

function Header({isHome, subtitle, widget}) {
    const navigate = useNavigate();
    const {enableNet, setEnableNet} = useContext(NetContext);

    return <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{backgroundColor: "#441650"}}>
                <Icon size="large" sx={{mt: 1, mb: 1, width: "50pt", height: "50pt"}}>
                    <img alt="Pithekos logo" style={{width: 'inherit', height: 'inherit'}} src="/client/favicon.svg"/>
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
                        <Cloud
                          onClick = {
                            () => {
                              fetch(`/net/disable`);
                              setEnableNet(false);
                            }
                          }
                          edge="start"
                          fontSize="large"
                          sx={{color: "#FF0000"}}
                        /> :
                        <CloudOff
                          onClick = {
                            () => {
                              fetch(`/net/enable`);
                              setEnableNet(true);
                            }
                          }
                          edge="start"
                          fontSize="large"
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
