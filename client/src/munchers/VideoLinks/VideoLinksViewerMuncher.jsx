import {useEffect, useState, useContext} from "react";
import {Box, Grid2, Typography} from "@mui/material";
import { NetContext } from "../../contexts/NetContext";

function VideoLinksViewerMuncher({metadata, systemBcv}) {
    const {enableNet} = useContext(NetContext);
    const [ingredient, setIngredient] = useState([]);
    const [verseNotes, setVerseNotes] = useState([]);

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

    useEffect(
        () => {
            setVerseNotes(
                ingredient
                    .filter(l => l[0] === `${systemBcv.chapterNum}:${systemBcv.verseNum}`)
                    .map(l => l[5])
            );
        },
        [ingredient]
    );

    return (
        <Box>
            <Typography variant="h5">
                {`${metadata.name} (${systemBcv.bookCode} ${systemBcv.chapterNum}:${systemBcv.verseNum})`}
            </Typography>
            <Typography variant="h6">Video Links Handler</Typography>
            <Grid2 container spacing={2}>
              {verseNotes.length === 0 && "No content for this verse"}
              {
                  verseNotes.length > 0 && enableNet &&
                      verseNotes.map(
                          note =>
                              <Grid2 size={6}>
                                  <video width="320" height="240" controls>
                                      <source src={note} type="video/mp4"/>
                                      No video support!
                                  </video>
                              </Grid2>
                      ) 
              }
              {
                  verseNotes.length > 0 && !enableNet && <b>Offline Mode</b>
              }
            </Grid2>
        </Box>
    );
}

export default VideoLinksViewerMuncher;
