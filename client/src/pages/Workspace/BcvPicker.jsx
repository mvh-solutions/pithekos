import React, {useState} from "react";
import {Box, TextField, Typography} from "@mui/material";

function BcvPicker({systemBcv, setSystemBcv}) {
    const [newRef, setNewRef] = useState("");
    return <Box>
        <Typography variant="h6">{`${systemBcv.bookCode} ${systemBcv.chapterNum}:${systemBcv.verseNum}`}</Typography>
        <TextField
            sx={{backgroundColor: "#DDCCEE"}}
            id="outlined-basic"
            label="New Reference"
            size="small"
            variant="outlined"
            value={newRef}
            onChange={
                e => {
                    const v = e.target.value;
                    setNewRef(v);
                }
            }
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    const [bookCode, cv] = newRef.split(" ");
                    if (bookCode && cv && bookCode.length === 3) {
                        let [c, v] = cv.split(":");
                        if (c && v) {
                            c = parseInt(c);
                            v = parseInt(v);
                            if (typeof c === "number" && typeof v === "number" && c>0 && v > 0 && c <= 150 && v <= 176) {
                                setSystemBcv({
                                    bookCode,
                                    chapterNum: c,
                                    verseNum: v
                                })
                            }
                        }
                    }
                    setNewRef("");
                    e.preventDefault();
                }
            }}
        />
    </Box>
}

export default BcvPicker;