import {useContext} from 'react';
import PtksPage from "../../components/PtksPage";
import {Grid2, Switch} from "@mui/material";
import {getJson} from "../../lib/get";
import DebugContext from "../../contexts/debug";
import I18nContext from "../../contexts/i18n";
import {doI18n} from "../../lib/i18n";

function Settings() {
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    return (
        <PtksPage
            isHome={false}
            subtitleKey="pages:settings:subtitle"
        >
            <Grid2 container>
                <Grid2 item size={6}>
                    {doI18n("pages:settings:debug_prompt", i18n)}
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
        </PtksPage>
    );
}

export default Settings;
