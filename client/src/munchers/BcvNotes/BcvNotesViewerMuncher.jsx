import {useEffect, useState, useContext} from "react";
import {Box} from "@mui/material";
import Markdown from 'react-markdown';
import BcvContext from "../../contexts/bcv";
import DebugContext from "../../contexts/debug";
import {getText} from "../../lib/get";

function BcvNotesViewerMuncher({metadata}) {
    const [ingredient, setIngredient] = useState([]);
    const {systemBcv} = useContext(BcvContext);
    const {debugRef} = useContext(DebugContext);

    const getAllData = async () => {
            const ingredientLink = `/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.tsv`;
            let response = await getText(ingredientLink, debugRef.current);
            if (response.ok) {
            }
            setIngredient(
                response.text
                    .split("\n")
                    .map(l => l.split("\t").map(f => f.replace(/\\n/g, "\n\n")))
            );
        };

    useEffect(
        () => {
            getAllData().then();
        },
        [systemBcv]
    );

    const verseNotes = ingredient
        .filter(l => l[0] === `${systemBcv.chapterNum}:${systemBcv.verseNum}`)
        .map(l => l[6]);
    return (
        <Box>
            <h5>{`${metadata.name} (${systemBcv.bookCode} ${systemBcv.chapterNum}:${systemBcv.verseNum})`}</h5>
            <h6>BCV Notes Handler</h6>
            <div>
                {ingredient &&
                    <Markdown>{
                        verseNotes.length > 0 ? verseNotes.join("\n\n") : "No notes found for this verse"
                    }</Markdown>}
            </div>
        </Box>
    );
}

export default BcvNotesViewerMuncher;
