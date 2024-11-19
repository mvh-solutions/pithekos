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
import {useState} from "react";

function RootElement() {
    const [enableNet, setEnableNet] = useState(false);
    const [systemBcv, setSystemBcv] = useState({
        bookCode: "TIT",
        chapterNum: 1,
        verseNum: 1
    });
    const router = createHashRouter([
        {
            path: "/",
            element: (
                <Home
                    enableNet={enableNet}
                    setEnableNet={setEnableNet}
                />
            ),
        },
        {
            path: "/workspace/*",
            element: (
                <Workspace
                    enableNet={enableNet}
                    systemBcv={systemBcv}
                    setSystemBcv={setSystemBcv}
                />
            ),
        },
        {
            path: "/download-project",
            element: (
                <DownloadProject enableNet={enableNet}/>
            ),
        },
        {
            path: "/new-project",
            element: (
                <NewProject enableNet={enableNet}/>
            ),
        },
        {
            path: "/settings",
            element: (
                <Settings enableNet={enableNet}/>
            ),
        }
    ]);
    return <Box sx={{height: '95vh', overflow: 'hidden'}}>
        <RouterProvider router={router}/>
    </Box>

}

createRoot(document.getElementById("root")).render(<RootElement/>);