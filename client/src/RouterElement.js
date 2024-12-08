import {useState, useEffect, useRef} from "react";
import {createHashRouter, RouterProvider} from "react-router-dom";
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Workspace from './pages/Workspace/Workspace';
import DownloadProject from './pages/DownloadProject/DownloadProject';
import NewProject from './pages/NewProject/NewProject';
import {Box} from '@mui/material';
import './index.css';
import {useSnackbar} from "notistack";
import MessagesContext from "./contexts/messages";
import NetContext from "./contexts/net";
import BcvContext from "./contexts/bcv";

function RouterElement({enableNet, setEnableNet, enabledRef}) {

    const netValue = {enableNet, setEnableNet, enabledRef};
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
        },
        {
            path: "/download-project",
            element: (
                <DownloadProject/>
            ),
        },
        {
            path: "/new-project",
            element: (
                <NewProject/>
            ),
        },
        {
            path: "/settings",
            element: (
                <Settings/>
            ),
        }
    ]);

    return <NetContext.Provider value={netValue}>
        <BcvContext.Provider value={bcvValue}>
            <MessagesContext.Provider value={messageValue}>
                <Box sx={{height: '100vh', overflow: 'hidden'}}>
                    <RouterProvider router={router}/>
                </Box>
            </MessagesContext.Provider>
        </BcvContext.Provider>
    </NetContext.Provider>
}

export default RouterElement;