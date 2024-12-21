import {useState, useEffect} from "react";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Home from './pages/Home/Home';
import Workspace from './pages/Workspace/Workspace';
import {Box} from '@mui/material';
import './index.css';
import {useSnackbar} from "notistack";
import MessagesContext from "./contexts/messages";
import NetContext from "./contexts/net";
import BcvContext from "./contexts/bcv";
import DebugContext from "./contexts/debug";
import I18nContext from "./contexts/i18n";

function RouterElement({enableNet, setEnableNet, enabledRef, debug, setDebug, debugRef, i18n}) {

    const netValue = {enableNet, setEnableNet, enabledRef};
    const debugValue = {debug, setDebug, debugRef};
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

    const router = createHashRouter([
        {
            path: "/",
            element: (
                <Home/>
            ),
        },
        {
            path: "/workspace/*",
            element: (
                <Workspace/>
            ),
        }
    ]);

    return <DebugContext.Provider value={debugValue}>
        <NetContext.Provider value={netValue}>
            <BcvContext.Provider value={bcvValue}>
                <MessagesContext.Provider value={messageValue}>
                    <I18nContext.Provider value={i18n}>
                        <Box sx={{height: '100vh', overflow: 'hidden'}}>
                            <RouterProvider router={router}/>
                        </Box>
                    </I18nContext.Provider>
                </MessagesContext.Provider>
            </BcvContext.Provider>
        </NetContext.Provider>
    </DebugContext.Provider>
}

export default RouterElement;