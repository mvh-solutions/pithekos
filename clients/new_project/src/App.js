import {useContext} from 'react';
import {Grid2} from "@mui/material";
import {i18nContext, doI18n} from "pithekos-lib";

function App() {
    const i18n = useContext(i18nContext);
    return <Grid2 container spacing={2}>
        <Grid2 size={12}>
            <h1>{doI18n("pages:core-new-project:stub_content", i18n)}</h1>
        </Grid2>
    </Grid2>
}

export default App;
