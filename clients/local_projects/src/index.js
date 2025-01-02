import React from 'react';
import {createRoot} from "react-dom/client";
import {Spa} from "pithekos-lib";
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import LocalProjects from "./pages/LocalProjects/LocalProjects";
import Workspace from "./pages/Workspace/Workspace";

const router = createHashRouter([
    {
        path: "/",
        element: <LocalProjects/>,
    },
    {
        path: "/workspace/*",
        element: <Workspace/>,
    }
]);

createRoot(document.getElementById("root"))
    .render(
        <Spa>
            <RouterProvider router={router}/>
        </Spa>
    );