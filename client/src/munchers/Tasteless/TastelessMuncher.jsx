import {useEffect, useState, useContext} from "react";
import {Box, Button, Grid2, Typography} from "@mui/material";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import DebugContext from "../../contexts/debug";
import {getJson} from "../../lib/get";
function TastelessMuncher({metadata}) {
    const [sbMetadata, setSbMetadata] = useState();
    const [showMetadata, setShowMetadata] = useState(false);
    const {debugRef} = useContext(DebugContext);

    const getAllData = async () => {
        const sbMetadataLink = `/burrito/metadata/raw/${metadata.local_path}`;
        let response = await getJson(sbMetadataLink, debugRef.current);
        if (response.ok) {
            setSbMetadata(response.json);
        }
    }

    useEffect(
        () => {
            getAllData().then();
        },
        []
    );

    return (
        <Box>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Typography variant="h5">{metadata.name}</Typography>
                    <Typography variant="body1">no muncher found</Typography>
                    {metadata.description.length > 0 &&
                        <Typography variant="body2">Description: {metadata.description}</Typography>}
                    <Typography variant="body2">Flavor: {metadata.flavor_type}/{metadata.flavor}</Typography>
                    <Typography variant="body2">Source: {metadata.local_path}</Typography>
                </Grid2>
                {sbMetadata &&
                    <>
                        <Grid2 size={12}>
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={showMetadata ? <UnfoldLessIcon/> : <UnfoldMoreIcon/>}
                                onClick={() => setShowMetadata(!showMetadata)}
                            >
                                Metadata
                            </Button>
                        </Grid2>
                        {showMetadata &&
                            <Grid2 size={12}>
                                <pre>{JSON.stringify(sbMetadata, null, 2)}</pre>
                            </Grid2>
                }
                    </>
                }
            </Grid2>
        </Box>
    );
}

export default TastelessMuncher;
