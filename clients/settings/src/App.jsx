import {useContext} from "react"
import {Grid2, Switch} from "@mui/material";
import {debugContext, i18nContext, doI18n, getJson} from "pithekos-lib";

function App() {
        const {debugRef} = useContext(debugContext);
    const i18n = useContext(i18nContext);
    return (
            <Grid2 container>
                <Grid2 item size={6}>
                    {doI18n("pages:core-settings:debug_prompt", i18n)}
                </Grid2>
                <Grid2 item size={6}>
                    <Switch
                        checked={debugRef.current}
                        onChange={() =>
                            debugRef.current ?
                                getJson("/debug/disable", debugRef.current) :
                                getJson("/debug/enable", debugRef.current)
                        }
                    />
                </Grid2>
            </Grid2>
    )

}

export default App;
