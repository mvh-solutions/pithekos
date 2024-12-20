import {useContext, useEffect, useState} from "react";
import I18nContext from "../contexts/i18n";
import NetContext from "../contexts/net";
import {AppBar, Box, Grid2, Menu, MenuItem, Paper, Toolbar, Typography} from "@mui/material";
import {BlockOutlined, Public, PublicOff} from "@mui/icons-material";
import {doI18n} from "../lib/i18n";
import {useSnackbar} from "notistack";
import DebugContext from "../contexts/debug";
import BcvContext from "../../contexts/bcv";
import MessagesContext from "../contexts/messages";
import MenuIcon from "@mui/icons-material/Menu";
import {getJson} from "../lib/get";
import SettingsIcon from "@mui/icons-material/Settings";


function AppWrapper({children, netValue, debugValue, i18n}) {

    const [systemBcv, setSystemBcv] = useState({
        bookCode: "TIT",
        chapterNum: 1,
        verseNum: 1
    });
    const bcvValue = {systemBcv, setSystemBcv};
    const [messages, setMessages] = useState([]);
    const messageValue = {messages, setMessages};
    const {enqueueSnackbar} = useSnackbar();
    const localHandler = s => {
        const dataBits = s.split('--');
        if (dataBits.length === 4) {
            enqueueSnackbar(
                `${dataBits[2]} => ${dataBits[3]}`,
                {
                    variant: dataBits[0],
                    anchorOrigin: {vertical: "top", horizontal: "left"}
                }
            );
        }
    }

    useEffect(() => {
            if (messages.length > 0) {
                messages.forEach(m => localHandler(m));
                setMessages([]);
            }
        },
        [messages]
    )

    return <DebugContext.Provider value={debugValue}>
        <NetContext.Provider value={netValue}>
            <BcvContext.Provider value={bcvValue}>
                <MessagesContext.Provider value={messageValue}>
                    <I18nContext.Provider value={i18n}>
                        <Box sx={{height: '100vh', overflow: 'hidden'}}>
                            {children}
                        </Box>
                    </I18nContext.Provider>
                </MessagesContext.Provider>
            </BcvContext.Provider>
        </NetContext.Provider>
    </DebugContext.Provider>
}

function Header({subtitle, widget}) {
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

function SpSpaPage({subtitleKey, widget, margin = 2, children, requireNet = false, netValue, debugValue, i18n}) {
    const {enableNet} = netValue;
    if (requireNet && !enableNet) {
        return (
            <AppWrapper
                netValue={netValue}
                debugValue={debugValue}
                i18n={i18n}
            >
                <Paper>
                    <Box sx={{
                        m: margin,
                        height: "100%",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}>
                        <Grid2 container spacing={0} direction="column" alignItems="center" justifyContent="center"
                               sx={{minHeight: '100vh'}}>
                            <Grid2 item>
                                <Box>
                                    <BlockOutlined fontSize="large" color="warning"/>
                                    <p>{doI18n("components:framework:no_entry_if_offline", i18n)}</p>
                                </Box>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Paper>
            </AppWrapper>
        );
    }
    return (
        <AppWrapper
            netValue={netValue}
            debugValue={debugValue}
            i18n={i18n}
        >
            <Paper>
                <Box>
                    <Header
                        subtitle={subtitleKey || null}
                        widget={widget || null}
                        margin={margin || 2}
                    />
                </Box>
                <Box sx={{
                    m: margin,
                    height: "100%",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}>
                    {children}
                </Box>
            </Paper>
        </AppWrapper>
    );
}

export default SpSpaPage;
