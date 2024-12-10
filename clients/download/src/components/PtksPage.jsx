import Header from "./Header";
import {Box, Paper} from "@mui/material";

function PtksPage({isHome, subtitleKey, widget, margin, children}) {
    return (
        <Paper>
            <Box>
                <Header
                    isHome={isHome || false}
                    subtitle={subtitleKey || null}
                    widget={widget || null}
                    margin={margin || 2}
                />
            </Box>
            <Box sx={{
                m: margin,
                height: "100%",
                overflowX: "hidden",
                overflowY: "auto",
            }}>
                {children}
            </Box>
        </Paper>
    );
}

export default PtksPage;
