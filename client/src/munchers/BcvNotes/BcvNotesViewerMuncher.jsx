import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import Markdown from 'react-markdown'

function BcvNotesViewerMuncher({metadata, systemBcv}) {
    const [ingredient, setIngredient] = useState([]);

    async function getData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Response status: ${response.status}\n${response}`);
            }

            return await response.text();
        } catch (error) {
            console.error(error.message);
        }
    }

    const getAllData = async () => {
        const ingredientLink = `/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.tsv`;
        let iL = await getData(ingredientLink);
        setIngredient(
            iL
                .split("\n")
                .map(l => l.split("\t").map(f => f.replace(/\\n/g, "\n\n")))
        );
    }

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
                    <Typography variant="h5">{`${metadata.name} (${systemBcv.bookCode} ${systemBcv.chapterNum}:${systemBcv.verseNum})`}</Typography>
                    <Typography variant="h6">BCV Notes Handler</Typography>
                    <Typography variant="body1">
                        {ingredient &&
                            <Markdown>{
                                verseNotes.length > 0 ? verseNotes.join("\n\n") : "No notes found for this verse"
                            }</Markdown>}
                    </Typography>
        </Box>
    );
}

export default BcvNotesViewerMuncher;