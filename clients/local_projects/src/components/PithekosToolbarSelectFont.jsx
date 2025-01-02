import {useContext} from "react";
import {Box, InputLabel, MenuItem, FormControl, Select} from "@mui/material";
import FontMenuItem from "./FontMenuItem";
import sx from "./PithekosToolbar.styles";
import PropTypes from 'prop-types';
import WebFontsArray from '../webfonts/_webfonts.json';
import {i18nContext as I18nContext, doI18n} from "pithekos-lib";

export default function PithekosToolbarSelectFont(PithekosToolbarSelectFontProps) {
    const i18n = useContext(I18nContext);
    const {
        selectedFontsetName,
        setSelectedFontsetName,
    } = PithekosToolbarSelectFontProps;

    const handleChange = (event) => {
        setSelectedFontsetName(event.target.value);
    };

    // WebFonts use a different css id from the actual font name to avoid conflict with locally installed fonts which could be a different version.
    const WebFonts =
        WebFontsArray.map((font, index) => (
            <MenuItem key={index} value={font.name} dense>
                <FontMenuItem font={font}/>
            </MenuItem>
        ));

    return (
        <div item style={{maxWidth: 250, padding: "1.25em 0"}}>
            <Box sx={{minWidth: 250}}>
                <FormControl fullWidth style={{maxWidth: 300}}>
                    <InputLabel id="select-font-label" htmlFor="select-font-id" sx={sx.inputLabel}>
                        {doI18n("pages:core-local-workspace:select_fontset", i18n)}
                    </InputLabel>
                    <Select
                        variant="standard"
                        labelId="select-font-label"
                        name="select-font-name"
                        inputProps={{
                            id: "select-font-id",
                        }}
                        value={selectedFontsetName}
                        label="Font"
                        onChange={handleChange}
                        sx={sx.select}
                    >
                        <b>
                            {doI18n("pages:core-local-workspace:select_fontset", i18n)}
                        </b>
                        {WebFonts}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );
}

PithekosToolbarSelectFont.propTypes = {
    /** Selected Font Set CSS Name */
    selectedFontsetName: PropTypes.string,
    /** Set Selected Font Set CSS Name */
    setSelectedFontsetName: PropTypes.func.isRequired,
};