import {createRoot} from "react-dom/client";
import {SpSpa} from "pithekos-lib";
import App from "./App";
import './index.css';

createRoot(document.getElementById("root"))
    .render(
        <SpSpa
            requireNet={true}
            titleKey="pages:core-remote-resources:title"
            currentId="core-remote-resources"
        >
            <App/>
        </SpSpa>
    );