import {useEffect, useState, useContext} from "react";
import "./TextTranslationEditorMuncher.css";
import { bcvContext as BcvContext, debugContext as DebugContext, getJson } from "pithekos-lib";

import Editor from "./Editor";

const uploadJsonIngredient = async (repoPath, ingredientPath, jsonData) => {
    // Convert JSON object to a file
    const jsonString = JSON.stringify(jsonData, null, 2);
    const file = new Blob([jsonString], { type: 'application/json' });

    // Create form data and append the file
    const formData = new FormData();
    formData.append('file', file, 'ingredient.json');

    try {
        const response = await fetch(
            `/burrito/ingredient/as-usj/${repoPath}?ipath=${ingredientPath}`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.reason || 'Upload failed');
        }

        return data;
    } catch (error) {
        console.error('Error uploading ingredient:', error);
        throw error;
    }
}

function TextTranslationEditorMuncher({metadata, selectedFontsetName}) {
    const {systemBcv} = useContext(BcvContext);
    const {debugRef} = useContext(DebugContext);
    // const i18n = useContext(I18nContext);
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
                console.log("useEffect", "Fetch new USFM", state.usj.working, systemBcv);
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

     const onSave = (usj) => {
        console.log("onSave", usj);
        if(usj.content.length > 0) {
            uploadJsonIngredient(metadata.local_path, systemBcv.bookCode + ".usj", usj);
        }
    }

    const onHistoryChange = ({ editorState }) => {

        /**
         * editorState is a LexicalEditorState object.
         * It has a toJSON() method that returns a JSON object.
         * This JSON object can be used to recover the editorState and save it to the browser local storage.
         */
        const recoverableState = editorState.toJSON();
        console.log("onHistoryChange", recoverableState);
    }

    return state.usj.working ? <Editor usj={state.usj.working} editable={true} bookCode={systemBcv.bookCode} onSave={onSave} onHistoryChange={onHistoryChange}/> : <div>Loading data...</div>;
}

export default TextTranslationEditorMuncher;
