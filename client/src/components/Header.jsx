import {useEffect} from "react";
import {AppBar, Box, Grid2, Icon, IconButton, Toolbar, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {Public, PublicOff} from "@mui/icons-material";

function Header({isHome, subtitle, widget, enableNet}) {
    const navigate = useNavigate();

    return <div sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{backgroundColor: "#441650"}}>
                <Grid2 container direction="row"
                       justifyContent="flex-end"
                       alignItems="center"
                       sx={{flexGrow: 1}}>
                    <Grid2 item size={{xs: 2, md: 1}}>
                        <Icon size="large" sx={{mt: 1, mb: 1, width: "50pt", height: "50pt"}}>
                            <img alt="Pithekos logo" style={{width: 'inherit', height: 'inherit'}}
                                 src="/client/favicon.svg"/>
                        </Icon>
                    </Grid2>
                    <Grid2 display="flex" size={{xs: 5, md: 4, lg: 2}} justifyContent="flex-start">
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
                    <Grid2 item size={{xs: 3, md: 5, lg: 7}}>
                        {widget}
                    </Grid2>
                    <Grid2 size={{xs: 1}} justifyContent="flex-end">
                        <SettingsIcon
                            fontSize="large"
                            color="inherit"
                            aria-label="settings"
                            sx={{mr: 2}}
                            onClick={() => navigate("/settings")}
                        />
                    </Grid2>
                    <Grid2 container size={{xs: 1}} justifyContent="flex-end">
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
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    </div>
}

export default Header;
