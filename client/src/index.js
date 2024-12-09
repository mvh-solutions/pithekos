import {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {SnackbarProvider, enqueueSnackbar} from "notistack";
import RouterElement from "./RouterElement";
import './index.css';
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {getJson} from "./lib/get";

function RootElement() {
    const [enableNet, _setEnableNet] = useState(false);
    const enabledRef = useRef(enableNet);
    const setEnableNet = nv => {
        enabledRef.current = nv;
        _setEnableNet(nv);
    };
    const [debug, _setDebug] = useState(false);
    const debugRef = useRef(debug);
    const setDebug = nv => {
        debugRef.current = nv;
        _setDebug(nv);
    };
    const [i18n, setI18n] = useState({});

    useEffect(
        () => {
            const doFetchI18n = async () => {
                const i18nResponse = await getJson("/i18n/flat", debugRef.current);
                if (i18nResponse.ok) {
                    setI18n(i18nResponse.json);
                } else {
                    enqueueSnackbar(
                        `Could not load i18n: ${i18nResponse.error}`,
                        {variant: "error"}
                    )
                }
            }
            doFetchI18n();
        },
        []
    );

    const netHandler = ev => {
        if (ev.data === "enabled" && !enabledRef.current) {
            setEnableNet(true);
        } else if (ev.data === "disabled" && enabledRef.current) {
            setEnableNet(false);
        }
    }

    const debugHandler = ev => {
        if (ev.data === "enabled" && !debugRef.current) {
            setDebug(true);
        } else if (ev.data === "disabled" && debugRef.current) {
            setDebug(false);
        }
    }

    const miscHandler = ev => {
        const dataBits = ev.data.split('--');
        if (dataBits.length === 4) {
            enqueueSnackbar(
                `${dataBits[2]} => ${dataBits[3]}`,
                {
                    variant: dataBits[0],
                    anchorOrigin: {vertical: "top", horizontal: "left"}
                }
            );
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const fetchSSE = async () => {
            await fetchEventSource("/notifications", {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                },
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        //console.log("Connected to SSE");
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Error from SSE", res.status);
                    }
                },
                onmessage(event) {
                    if (event.event === "misc") {
                        miscHandler(event)
                    } else if (event.event === "net_status") {
                        netHandler(event)
                    } else if (event.event === "debug") {
                        debugHandler(event)
                    }

                },
                onclose() {
                    console.log("SSE connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from the SSE server", err);
                },
            });
        };
        fetchSSE();
        return () => controller.abort();
    }, []);


    return <SnackbarProvider maxSnack={3}>
        <RouterElement
            enableNet={enableNet}
            setEnableNet={setEnableNet}
            enabledRef={enabledRef}
            debug={debug}
            setDebug={setDebug}
            debugRef={debugRef}
            i18n={i18n}
        />
    </SnackbarProvider>
}

createRoot(document.getElementById("root"))
    .render(<RootElement/>);