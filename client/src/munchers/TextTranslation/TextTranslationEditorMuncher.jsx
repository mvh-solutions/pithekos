import {useEffect, useState} from "react";
import "./TextTranslationEditorMuncher.css";
import {
    ParaRenderer,
    ChapterRenderer
} from "./blockRenderers";
import {Grid2} from "@mui/material";
import dcopy from "deep-copy";

async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Response status: ${response.status}\n${response}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

function TextTranslationEditorMuncher({metadata, systemBcv, selectedFontsetName}) {
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

    const setSelectedPath = newPath => setState({
        ...state,
        selectedPath: newPath,
        rerenderNeeded: true
    });

    const setUsjNode1 = (usj, path, newValue) => {
        // console.log(path, newValue);
        if (path.length === 0) {
            console.log(`Path empty in setUsjNode() for newValue of '${newValue}'`);
            return;
        }
        if (path.length > 1) {
            setUsjNode1(
                usj["content"][path[0]],
                path.slice(1),
                newValue
            );
        } else { // attribute of object
            if (typeof path[0] === "number") {
                usj.content[path[0]] = newValue;
            } else { // attribute of object
                usj[path[0]] = newValue;
            }
        }
    }

    const setUsjNode = (path, newValue) => {
        const newUsj = dcopy(state.usj.working);
        setUsjNode1(newUsj, path, newValue);
        // console.log(newUsj);
        setState({
            ...state,
            usj: {
                ...state.usj,
                working: newUsj
            },
        });
    }

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
                getData(usfmLink)
                    .then(
                        res => {
                            setState(
                                {
                                    ...state,
                                    usj: {
                                        ...state.usj,
                                        incoming: res
                                    },
                                    navigation: {
                                        bookCode: systemBcv.bookCode,
                                        chapterNum: systemBcv.chapterNum,
                                        verseNum: systemBcv.verseNum
                                    }
                                }
                            );
                        }).catch(err => console.log("TextTranslation fetch error", err));
            }
        },
        [systemBcv, state]
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

    return state.rendered ?
        <div className={selectedFontsetName}>
            <Grid2 container spacing={2}>
                {
                    Object.entries(state.rendered.headers).map(
                        (h, n) => <>
                            <Grid2 key={`${n}a`} size={1}>
                                {h[0]}
                            </Grid2>
                            <Grid2  key={`${n}b`} size={11}>
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
                                return <ChapterRenderer
                                    key={n}
                                    usj={state.usj.working}
                                    nPara={cj.nPara}
                                    selectedPath={cj.selectedPath || [-1]}
                                    setSelectedPath={setSelectedPath}
                                    setUsjNode={setUsjNode}
                                />
                            } else return <ParaRenderer
                                key={n}
                                usj={state.usj.working}
                                marker={cj.marker}
                                nPara={cj.nPara}
                                selectedPath={cj.selectedPath || [-1]}
                                setSelectedPath={setSelectedPath}
                                setUsjNode={setUsjNode}
                            />
                        }
                    )
            }
        </div>
        :
        <div>Rendering</div>
}

export default TextTranslationEditorMuncher;
