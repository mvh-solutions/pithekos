import React, {useState, useEffect, useContext} from 'react';
import {Box, Grid2} from "@mui/material";
import {getAndSetJson, i18nContext, netContext, doI18n} from 'pithekos-lib';
import ArrowForward from '@mui/icons-material/ArrowForward';

function App() {
    const [clients, setClients] = useState([]);
    useEffect(
        () => {
            getAndSetJson({
                url: "/list-clients",
                setter: setClients
            }).then()
        },
        []
    );
    const i18n = useContext(i18nContext);
    const {enabledRef} = useContext(netContext);
    console.log("enableRef", enabledRef);
    return <Grid2 container spacing={2}>
        <Grid2 size={12}>
            <h1>{doI18n("pages:core-dashboard:title", i18n)}</h1>
        </Grid2>
        {
            clients
                .filter(c => !c.id.includes("dashboard"))
                .map(
                    c => <Grid2 size={6}>
                        <Box
                            sx={{
                                border: "1px black solid",
                                backgroundColor: (enabledRef.current || !c.requires.net) ? "#FFF" : "#CCC"
                        }}
                            p={2}
                        >
                            <h2>
                                {doI18n(`pages:${c.id}:title`, i18n)}
                                {(enabledRef.current || !c.requires.net) && <ArrowForward
                                    sx={{float: "right"}}
                                    onClick={()=> {window.location.href = c.url}}
                                />}
                            </h2>
                            <p>{doI18n(`pages:${c.id}:summary`, i18n)}</p>
                        </Box>
                    </Grid2>
                )
        }
    </Grid2>
}

export default App;
