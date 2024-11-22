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
import { NetContext } from "./contexts/NetContext";
import './index.css';

function RootElement() {
  const [enableNet, setEnableNet] = React.useState(false)
  const value = React.useMemo(
    () => ({ enableNet, setEnableNet }), 
    [enableNet]
  )

return <NetContext.Provider value={value}>
        {React.useMemo(() => (
          <RouterElement/>
      ), [])}
</NetContext.Provider>
}

function RouterElement() {
  console.log('root');
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
                />
            ),
        },
        {
            path: "/workspace/*",
            element: (
                <Workspace
                    systemBcv={systemBcv}
                    setSystemBcv={setSystemBcv}
                />
            ),
        },
        {
            path: "/download-project",
            element: (
                <DownloadProject
                />
            ),
        },
        {
            path: "/new-project",
            element: (
                <NewProject
                />
            ),
        },
        {
            path: "/settings",
            element: (
                <Settings
                />
            ),
        }
    ]);
    return <Box sx={{height: '95vh', overflow: 'hidden'}}>
        <RouterProvider router={router}/>
    </Box>

}

createRoot(document.getElementById("root")).render(<RootElement/>);