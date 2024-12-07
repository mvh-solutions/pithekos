import * as React from "react";
import {createRoot} from "react-dom/client";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Workspace from './pages/Workspace/Workspace';
import DownloadProject from './pages/DownloadProject/DownloadProject';
import NewProject from './pages/NewProject/NewProject';
import {Box} from '@mui/material';
import './index.css';
import {useEffect, useRef} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {SnackbarProvider, useSnackbar} from "notistack";

function RootElement() {
    const [enableNet, _setEnableNet] = React.useState(false);
    const enabledRef = useRef(enableNet);
    const setEnableNet = nv => {
        enabledRef.current = nv;
        _setEnableNet(nv);
    };
    return <SnackbarProvider maxSnack={3}>
        <RouterElement enableNet={enableNet} setEnableNet={setEnableNet} enabledRef={enabledRef}/>
    </SnackbarProvider>
}

function RouterElement({enableNet, setEnableNet, enabledRef}) {
    const [systemBcv, setSystemBcv] = React.useState({
        bookCode: "TIT",
        chapterNum: 1,
        verseNum: 1
    });
    const router = createHashRouter([
        {
            path: "/",
            element: (
                <Home
                    setEnableNet={setEnableNet}
                    enableNet={enableNet}
                    enabledRef={enabledRef}
                />
            ),
        },
        {
            path: "/workspace/*",
            element: (
                <Workspace
                    systemBcv={systemBcv}
                    setSystemBcv={setSystemBcv}
                    setEnableNet={setEnableNet}
                    enableNet={enableNet}
                    enabledRef={enabledRef}
                />
            ),
        },
        {
            path: "/download-project",
            element: (
                <DownloadProject
                    setEnableNet={setEnableNet}
                    enableNet={enableNet}
                    enabledRef={enabledRef}
                />
            ),
        },
        {
            path: "/new-project",
            element: (
                <NewProject
                    setEnableNet={setEnableNet}
                    enableNet={enableNet}
                    enabledRef={enabledRef}
                />
            ),
        },
        {
            path: "/settings",
            element: (
                <Settings
                    setEnableNet={setEnableNet}
                    enableNet={enableNet}
                    enabledRef={enabledRef}
                />
            ),
        }
    ]);

    const {enqueueSnackbar} = useSnackbar();
    const miscHandler = ev => {
        const dataBits = ev.data.split('--');
        if (dataBits.length === 4) {
            enqueueSnackbar(
                `${dataBits[2]} => ${dataBits[3]}`,
                {
                    variant: dataBits[0],
                    anchorOrigin: {vertical: "top", horizontal: "left" }
                }
            );
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource("/notifications/misc", {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                },
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        //console.log("Connected to misc SSE");
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Error from misc SSE", res.status);
                    }
                },
                onmessage(event) {
                    miscHandler(event)
                },
                onclose() {
                    console.log("Misc SSE connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from the Misc SSE server", err);
                },
            });
        };
        fetchData();
    }, []);

    return <Box sx={{height: '95vh', overflow: 'hidden'}}>
            <RouterProvider router={router}/>
        </Box>
}

createRoot(document.getElementById("root")).render(<RootElement/>);