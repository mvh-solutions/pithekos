import React, {useEffect, useRef, useState} from "react";
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

function WorkspacePicker({repos, setRepos}) {
    const [repoData, setRepoData] = useState({});
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

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

    const getAllData = async () => {
        const newRepoData = {};
        for (const repo of repos) {
            const metadataLink = `/burrito/metadata/summary/${repo}`;
            newRepoData[repo] = await getData(metadataLink);
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
                    flavor: `${v.flavor_type}/${v.flavor}`,
                    local_path: k,
                    selected: <Checkbox
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
                        <EditNote fontSize="large"/>
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

    return <Grid2 container spacing={0}>
        <Grid2 size={12}>
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
                                <Grid2 container size="grow">
                                    <Grid2 item size="grow">
                                        <Box>
                                            <Typography variant="h6">
                                                {row.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {row.description}
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
                                <Grid2 container>
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
        </Grid2>
    </Grid2>
}

export default WorkspacePicker;
