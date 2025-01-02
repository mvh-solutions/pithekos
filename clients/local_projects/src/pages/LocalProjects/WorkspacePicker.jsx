import React, {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import dcopy from "deep-copy";
import {
    Checkbox,
    Grid2,
    Box,
    Typography,
    IconButton, Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import DeleteProjectButton from "./DeleteProjectButton";
import {EditNote} from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {debugContext, i18nContext, getJson, doI18n} from "pithekos-lib";

function WorkspacePicker({repos}) {
    const [repoData, setRepoData] = useState({});
    const [rows, setRows] = useState([]);
    const {debugRef} = useContext(debugContext);
    const i18n = useContext(i18nContext);
    const navigate = useNavigate();

    const getAllData = async () => {
        const newRepoData = {};
        for (const repo of repos) {
            const metadataLink = `/burrito/metadata/summary/${repo}`;
            const repoMetadata = await getJson(metadataLink, debugRef.current);
            if (!repoMetadata.ok) {
                continue;
            }
            newRepoData[repo] = repoMetadata.json;
            newRepoData[repo]["editSelected"] = repoData && repoData[repo] ? repoData[repo].editSelected : false;
        }
        setRepoData(newRepoData);
    }

    const refreshTable = () => {
        let newRows = [];
        for (const [k, v] of Object.entries(repoData)) {
            newRows.push(
                {
                    name: v.name,
                    description: v.description,
                    flavor: doI18n(`flavors:names:${v.flavor_type}/${v.flavor}`, i18n),
                    local_path: k,
                    selected: <Checkbox
                        size="small"
                        checked={v.editSelected}
                        onClick={e => e.stopPropagation()}
                        onChange={(e) => {
                            const newRepoData = dcopy(repoData);
                            newRepoData[k].editSelected = !newRepoData[k].editSelected;
                            setRepoData(newRepoData);
                        }
                        }
                        inputProps={{'aria-label': 'controlled'}}
                    />,
                    go: <IconButton
                        disabled={!v.editSelected}
                        onClick={
                            (e) => {
                                const newRepoData = dcopy(repoData);
                                for (const k2 of Object.keys(newRepoData)) {
                                    newRepoData[k2].primary = (k === k2);
                                }
                                navigate(
                                    "/workspace",
                                    {
                                        state:
                                            Object.fromEntries(
                                                Object.entries(newRepoData)
                                                    .filter(kv => kv[1].editSelected)
                                            )
                                    }
                                );
                                e.stopPropagation();
                            }
                        }
                    >
                        <EditNote/>
                    </IconButton>
                }
            );
            setRows(newRows);
        }
    }

    useEffect(
        () => {
            getAllData().then();
        },
        [repos]
    );
    useEffect(
        () => {
            refreshTable();
        },
        [repoData]
    );

    return <Box sx={{
        height: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
    }}>
        {
            rows.map(
                (row, n) =>
                    <Accordion>
                        <AccordionSummary
                            sx={{width: "100vw"}}
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={`panel${n}-content`}
                            id={`panel${n}-header`}
                        >
                            <Grid2 container sx={{width: "100%"}} spacing={0}>
                                <Grid2 item size={10}>
                                    <Box>
                                        <Typography variant="body">
                                            <strong>
                                                {row.name}
                                            </strong>
                                            {row.description.length > 0 && row.name !== row.description ? `: ${row.description}` : ""}
                                        </Typography>
                                    </Box>
                                </Grid2>
                                <Grid2 item size={1}>
                                    {row.selected}
                                </Grid2>
                                <Grid2 item size={1}>
                                    {row.go}
                                </Grid2>
                            </Grid2>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={0}>
                                <Grid2 item size={1}>
                                    <Box>
                                        <DeleteProjectButton project={row.local_path}/>
                                    </Box>
                                </Grid2>
                                <Grid2 item size={11}>
                                    <Box>
                                        <Typography variant="body2">
                                            {row.flavor}
                                        </Typography>
                                        <Typography variant="body2">
                                            {row.local_path}
                                        </Typography>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
            )
        }
    </Box>
}

export default WorkspacePicker;
