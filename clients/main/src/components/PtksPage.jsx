import Header from "./Header";
import {Box, Paper} from "@mui/material";

function PtksPage({isHome, subtitleKey, widget, children}) {
    return (
        <Paper>
            <Box>
                <Header
                    isHome={isHome || false}
                    subtitle={subtitleKey || null}
                    widget={widget || null}
                />
            </Box>
            <Box sx={{
                p: 2,
                height: "100vh",
                overflowX: "hidden",
                overflowY: "scroll",
            }}>
                {children}
            </Box>
        </Paper>
    );
}

export default PtksPage;
