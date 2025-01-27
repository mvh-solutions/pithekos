import {useEffect, useState, useContext} from "react";
import "./TextTranslationViewerMuncher.css";
import {Grid2} from "@mui/material";

import {getJson, debugContext, bcvContext} from "pithekos-lib";

function TextTranslationViewerMuncher({metadata, selectedFontClass}) {
    const {systemBcv} = useContext(bcvContext);
    const {debugRef} = useContext(debugContext);
    // const i18n = useContext(i18nContext);
    const [state, setState] = useState({
        usj: {
            working: null,
            incoming: null,
        },
        navigation: {
            bookCode: null,
            chapterNum: null,
            verseNum: null,
        },
        rerenderNeeded: false,
        rendered: null,
        selectedPath: null,
        firstBodyPara: null
    });
    // Fetch new USFM as USJ, put in incoming
    useEffect(
        () => {
            if (
                    (!state.usj.working && !state.usj.incoming) ||
                    state.navigation.bookCode !== systemBcv.bookCode ||
                    state.navigation.chapterNum !== systemBcv.chapterNum
            ) {
                console.log("useEffect", "Fetch new USFM", state.usj.working, systemBcv.bookCode);
                const usfmLink = `/burrito/ingredient/as-usj/${metadata.local_path}?ipath=${systemBcv.bookCode}.usfm`;
                getJson(usfmLink, debugRef.current)
                    .then(
                        res => {
                            if (res.ok) {
                                setState(
                                    {
                                        ...state,
                                        usj: {
                                            ...state.usj,
                                            incoming: res.json
                                        },
                                        navigation: {
                                            bookCode: systemBcv.bookCode,
                                            chapterNum: systemBcv.chapterNum,
                                            verseNum: systemBcv.verseNum
                                        }
                                    }
                                );
                            } else {
                                console.log(`TextTranslation returned status ${res.status}`);
                            }
                        }).catch(err => console.log("TextTranslation fetch error", err));
            }
        },
        [systemBcv, state, metadata, debugRef]
    );

    // Move incoming USJ to working and increment updates
    useEffect(
        () => {
            if (state.usj.incoming) {
                console.log("useEffect", "Move USJ to working");
                setState(
                    {
                        ...state,
                        usj: {
                            ...state.usj,
                            incoming: null,
                            working: state.usj.incoming,
                        },
                        rerenderNeeded: true
                    });
            }
        },
        [state]
    );

    // Generate rendered from working
    useEffect(
        () => {
            if (state.rerenderNeeded) {
                console.log("useEffect", "rerender");
                let headers = {};
                let paras = [];
                let nPara = 0;
                let newFirstBodyPara = -1;
                let inChapter = false;
                for (const contentElement of state.usj.working.content) {
                    if (contentElement.marker === "id") {
                        headers[contentElement.marker] = `${contentElement.code} ${contentElement.content}`;
                    } else if (["h", "toc", "toc1", "toc2", "toc3"].includes(contentElement.marker)) {
                        headers[contentElement.marker] = contentElement.content;
                    } else {
                        if (contentElement.marker === "c") {
                            inChapter = (parseInt(contentElement.number) === state.navigation.chapterNum);
                        }
                        if (inChapter) {
                            if (newFirstBodyPara < 0) {
                                newFirstBodyPara = nPara;
                            }
                            paras.push(
                                {
                                    "type": contentElement.type,
                                    "content": contentElement.content || [],
                                    "number": contentElement.number || 0,
                                    "marker": contentElement.marker || "unknown",
                                    nPara,
                                    selectedPath: state.selectedPath
                                }
                            );
                        }
                    }
                    nPara++;
                }
                setState({
                    ...state,
                    rerenderNeeded: false,
                    rendered: {headers, paras},
                    firstBodyPara: newFirstBodyPara,
                    selectedPath: state.selectedPath || [newFirstBodyPara, 0]
                });
            }
        },
        [state]
    );

    const renderElement = element => {
        if (typeof element === "string") {
            return element;
        }
        if (element.marker === "v") {
            return <span className="usfm-v">{element.number}</span>;
        }
        if (element.type === "ms") {
            return " ";
        }
        return <span className={`usfm-${element.marker}`}>{element.content.map(e => renderElement(e))}</span>
    }

    return state.rendered ?
        <div className={selectedFontClass}>
            <Grid2 container spacing={2}>
                {
                    Object.entries(state.rendered.headers).map(
                        (h, n) => <>
                            <Grid2 key={`${n}a`} size={1}>
                                {h[0]}
                            </Grid2>
                            <Grid2 key={`${n}b`} size={11}>
                                {h[1]}
                            </Grid2>
                        </>
                    )
                }
            </Grid2>
            {
                state.rendered.paras
                    .map(
                        (cj, n) => {
                            if (!state.usj.working.content[cj.nPara]) {
                                return <div key={n}>?</div>;
                            }
                            if (cj.marker === "c") {
                                return <p className="usfm-c">{cj.number}</p>
                            } else return <p className={`usfm-${cj.marker}`}>{
                                cj.content.map(
                                    ii => renderElement(ii)
                                )
                            }</p>
                        }
                    )
            }
        </div>
        :
        <div>Rendering</div>
}

export default TextTranslationViewerMuncher;
