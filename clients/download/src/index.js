import {createRoot} from "react-dom/client";
import SPSPA from "./framework/components/SPSPA";
import App from "./App";
import './index.css';

createRoot(document.getElementById("root"))
    .render(
        <SPSPA
            requireNet={true}
            subtitleKey="pages:download_project:subtitle"
        >
            <App/>
        </SPSPA>
    );