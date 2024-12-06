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
import {useRef} from "react";

function RootElement() {
    const [enableNet, _setEnableNet] = React.useState(false);
    const enabledRef = useRef(enableNet);
    const setEnableNet = nv => {
        enabledRef.current = nv;
        _setEnableNet(nv);
    };
    return <RouterElement enableNet={enableNet} setEnableNet={setEnableNet} enabledRef={enabledRef}/>
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
    return <Box sx={{height: '95vh', overflow: 'hidden'}}>
        <RouterProvider router={router}/>
    </Box>

}

createRoot(document.getElementById("root")).render(<RootElement/>);