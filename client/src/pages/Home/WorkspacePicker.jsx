import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import dcopy from "deep-copy";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Checkbox,
    Grid2,
    Box,
    Typography,
    IconButton,
    Switch,
} from "@mui/material";
import DeleteProjectButton from "./DeleteProjectButton";
import {Cloud, CloudOff, EditNote, ReadMore} from "@mui/icons-material";
import DownloadProjectButton from "./DownloadProjectButton";
import NewProjectButton from "./NewProjectButton";

function WorkspacePicker({enableNet, setEnableNet}) {
    const [repoData, setRepoData] = useState({});
    const [rows, setRows] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();



    const [repos, setRepos] = useState([]);
    const pollingFunc = async () => {
        const response = await fetch("/git/list-local-repos");
        setRepos(await response.json());
    }
    const pollingRef = useRef(null);
    useEffect(() => {
        const startPolling = () => {
            pollingRef.current = setInterval(() => {
                pollingFunc();
            }, 2000); // Poll every 5 seconds
        };
        startPolling();

        return () => {
            clearInterval(pollingRef.current);
        };
    }, []);

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
            newRepoData[repo]["selected"] = repoData && repoData[repo] ? repoData[repo].selected :false;
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
                        checked={v.selected}
                        onChange={() => {
                            const newRepoData = dcopy(repoData);
                            newRepoData[k].selected = !newRepoData[k].selected;
                            setRepoData(newRepoData);
                        }
                        }
                        inputProps={{'aria-label': 'controlled'}}
                    />,
                    go: <IconButton
                        disabled={!v.selected}
                        onClick={
                            () => {
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
                                                    .filter(kv => kv[1].selected)
                                            )
                                    }
                                )
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

    return (
        <Grid2 container spacing={0}>
            <Grid2 size={12} container spacing={0} sx={{background: "#DDCCEE"}}>
                <Grid2 size={3}>
                    <Box alignItems="center" justifyContent="center" display="flex" flexDirection="column">
                        {enableNet ? <Cloud fontSize="large" sx={{color: "#FF0000"}}/> : <CloudOff fontSize="large"/>}
                        <Switch
                            onClick={() => setEnableNet(!enableNet)}
                        />
                    </Box>
                </Grid2>
                <Grid2 size={3}>
                    <Box alignItems="stretch" justifyContent="center" display="flex">
                        <DownloadProjectButton enabled={enableNet}/>
                    </Box>
                </Grid2>
                <Grid2 size={3}>
                    <Box alignItems="center" justifyContent="center" display="flex">
                        <NewProjectButton/>
                    </Box>
                </Grid2>
                <Grid2 size={3}>
                    <Box alignItems="center" justifyContent="center" display="flex" flexDirection="column">
                        <ReadMore
                            fontSize="large"
                            color={showDetails ? "" : "disabled"}
                        />
                        <Switch
                            onClick={() => setShowDetails(!showDetails)}
                        />
                    </Box>
                </Grid2>
            </Grid2>
            <Grid2 size={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="projects table">
                        <TableBody>
                            {rows.map((row, n) => (
                                <TableRow
                                    key={row.local_path}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    style={n % 2 ? {background: "#EEEEEE"} : {background: "white"}}
                                >
                                    <TableCell align="left">
                                        <Box>
                                            <Typography variant="h6">
                                                {row.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {row.description}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    {showDetails &&
                                        <TableCell align="left">
                                            <Box>
                                                <Typography variant="body2">
                                                    {row.flavor}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {row.local_path}
                                                </Typography>
                                                <Box>
                                                    <DeleteProjectButton project={row.local_path}/>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    }
                                    <TableCell align="right">{row.selected}</TableCell>
                                    <TableCell align="right">{row.go}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid2>
        </Grid2>
    );
}

export default WorkspacePicker;
