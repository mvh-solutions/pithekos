import {useEffect, useState} from "react";
import "./TextTranslationEditorMuncher.css";
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

function TextTranslationEditorMuncher({metadata, systemBcv}) {
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
                getData(usfmLink)
                    .then(
                        res => {
                            console.log("useEffect", "Fetch new USFM", res);
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
        [systemBcv, state, metadata.local_path]
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

    return state.usj.working ? <Editor usj={state.usj.working} editable={true} bookCode={systemBcv.bookCode} onSave={onSave} onHistoryChange={onHistoryChange}/> : <div>Loading...</div>;
}

export default TextTranslationEditorMuncher;
