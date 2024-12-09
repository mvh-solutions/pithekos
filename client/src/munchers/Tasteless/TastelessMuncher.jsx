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
                    <h5>{metadata.name}</h5>
                    <p><b>no muncher found</b></p>
                    {metadata.description.length > 0 &&
                        <p>Description: {metadata.description}</p>}
                    <p>Flavor: {metadata.flavor_type}/{metadata.flavor}</p>
                    <p>Source: {metadata.local_path}</p>
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
                                {JSON.stringify(sbMetadata, null, 2)}
                            </Grid2>
                        }
                    </>
                }
            </Grid2>
        </Box>
    );
}

export default TastelessMuncher;
