import {createRoot} from "react-dom/client";
import SpSpa from "./framework/components/SpSpa";
import App from "./App";
import './index.css';

createRoot(document.getElementById("root"))
    .render(
        <SpSpa
            requireNet={true}
            subtitleKey="pages:download_project:subtitle"
        >
            <App/>
        </SpSpa>
    );