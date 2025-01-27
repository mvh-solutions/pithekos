import {useEffect, useContext, useState} from "react";
import {Grid2, FormHelperText, Box, InputLabel, MenuItem, FormControl, Select} from "@mui/material";
import FontMenuItem from "./FontMenuItem";
import sx from "./PithekosToolbar.styles";
import PropTypes from 'prop-types';
import {i18nContext as I18nContext, doI18n } from "pithekos-lib";

export default function PithekosToolbarSelectFont(PithekosToolbarSelectFontProps) {
  const i18n = useContext(I18nContext);
  const {
      activeFontClass,
      setSelectedFontClass,
      selectedHebrewFontClass,
      setSelectedHebrewFontClass,
      selectedMyanmarFontClass,
      setSelectedMyanmarFontClass,
      selectedArabicUrduFontClass,
      setSelectedArabicUrduFontClass,
      selectedOtherFontClass,
      setSelectedOtherFontClass,
      selectedFallbackFontClass,
      setSelectedFallbackFontClass,
  } = PithekosToolbarSelectFontProps;

  const [activeHebrewFontClass, setActiveHebrewFontClass] = useState('');
  const [activeMyanmarFontClass, setActiveMyanmarFontClass] = useState('');
  const [activeArabicUrduFontClass, setActiveArabicUrduFontClass] = useState('');
  const [activeOtherFontClass, setActiveOtherFontClass] = useState('');
  const [activeFallbackFontClass, setActiveFallbackFontClass] = useState('');
  const [hebrewSelected, setHebrewSelected] = useState(false);
  const [myanmarSelected, setMyanmarSelected] = useState(false);
  const [arabicUrduSelected, setArabicUrduSelected] = useState(false);
  const [otherSelected, setOtherSelected] = useState(false);
  const [fallbackSelected, setFallbackSelected] = useState(false);
  
  useEffect ( () => {
    const webFontsHebrew = [
      { name: 'Ezra SIL 2.51', id: 'Pankosmia-EzraSIL' },
      { name: 'Ezra SIL SR 2.51', id: 'Pankosmia-EzraSILSR' },
      { name: '- ' + doI18n("pages:core-local-workspace:other-fallback", i18n) + ' -', id: '' },
    ];
  
    const webFontsMyanmar = [
      { name: 'Padauk 5.100', id: 'Pankosmia-Padauk' },
      { name: 'Padauk Book 5.100', id: 'Pankosmia-PadaukBook' },
      { name: '- ' + doI18n("pages:core-local-workspace:other-fallback", i18n) + ' -', id: '' },
    ];
  
    const webFontsArabicUrdu = [
      { name: 'Awami Nastaliq 3.300*', id: 'Pankosmia-AwamiNastaliqPankosmia-NotoNastaliqUrdu' },
      { name: 'Awami Nastaliq Medium 3.300*', id: 'Pankosmia-AwamiNastaliqMediumPankosmia-NotoNastaliqUrdu' },
      { name: 'Awami Nastaliq Semi Bold 3.300*', id: 'Pankosmia-AwamiNastaliqSemiBoldPankosmia-NotoNastaliqUrdu' },
      { name: 'Awami Nastaliq Extra Bold 3.300*', id: 'Pankosmia-AwamiNastaliqExtraBoldPankosmia-NotoNastaliqUrdu' },
      { name: 'Noto Naskh Arabic 2022', id: 'Pankosmia-NotoNaskhArabic' },
      { name: '- ' + doI18n("pages:core-local-workspace:other-fallback", i18n) + ' -', id: '' },
    ];
    
    const webFontsOther = [
      { name: 'Andika 6.200', id: 'Pankosmia-Andika' },
      { name: 'Cardo 2011', id: 'Pankosmia-Cardo' },
      { name: 'Charis SIL 6.200', id: 'Pankosmia-CharisSIL' },
      { name: 'Open Sans 2020', id: 'Pankosmia-OpenSans' },
      { name: 'Roboto 2004', id: 'Pankosmia-Roboto' },
      { name: 'Roboto Black 2004', id: 'Pankosmia-RobotoBlack' },
      { name: 'Roboto Light 2004', id: 'Pankosmia-RobotoLight' },
      { name: 'Roboto Medium 2004', id: 'Pankosmia-RobotoMedium' },
      { name: 'Roboto Thin 2004', id: 'Pankosmia-RobotoThin' },
      { name: '- ' + doI18n("pages:core-local-workspace:fallback", i18n) + ' -', id: '' },
    ];
  
    const webFontsFallback = [
      { name: 'Gentium Plus 6.200', id: 'Pankosmia-GentiumPlus' },
      { name: 'Gentium Book Plus 6.200', id: 'Pankosmia-GentiumBookPlus' },
    ];

    const fontClassIds = (activeFontClass !== undefined ? activeFontClass.replace(/Pankosmia-/g,'~Pankosmia-').split('~') : []);

    const webFontsHebrewIds = webFontsHebrew.map((font, index) => (font.id));
    const activeHebrewId = fontClassIds.filter(item => webFontsHebrewIds.includes(item));
    setActiveHebrewFontClass(activeHebrewId);

    const webFontsMyanmarIds = webFontsMyanmar.map((font, index) => (font.id));
    const activeMyanmarId = fontClassIds.filter(item => webFontsMyanmarIds.includes(item));
    setActiveMyanmarFontClass(activeMyanmarId);

    const webFontsArabicUrduIds = webFontsArabicUrdu.map((font, index) => (font.id));
    const fontClassAwamiToAdj = fontClassIds.filter(item => item.includes('AwamiNastaliq'));
    const activeArabicUrduId = (fontClassAwamiToAdj !== '' ? fontClassAwamiToAdj + 'Pankosmia-NotoNastaliqUrdu' : fontClassIds.filter(item => webFontsArabicUrduIds.includes(item)));
    setActiveArabicUrduFontClass(activeArabicUrduId);

    const webFontsOtherIds = webFontsOther.map((font, index) => (font.id));
    const activeOtherId = fontClassIds.filter(item => webFontsOtherIds.includes(item));
    setActiveOtherFontClass(activeOtherId);

    const webFontsFallbackIds = webFontsFallback.map((font, index) => (font.id));
    const activeFallbackId = fontClassIds.filter(item => webFontsFallbackIds.includes(item));
    setActiveFallbackFontClass(activeFallbackId);
  },[activeFontClass, i18n])

  const hebrew = hebrewSelected ? selectedHebrewFontClass : activeHebrewFontClass;
  const myanmar = myanmarSelected ? selectedMyanmarFontClass : activeMyanmarFontClass;
  const arabicUrdu = arabicUrduSelected ? selectedArabicUrduFontClass : activeArabicUrduFontClass;
  const other = otherSelected ? selectedOtherFontClass : activeOtherFontClass;
  const fallback = fallbackSelected ? selectedFallbackFontClass : activeFallbackFontClass;

  const handleChangeHebrew = (event) => {
    setHebrewSelected(true);
    setSelectedHebrewFontClass(event.target.value);
    setSelectedFontClass('fonts-' + event.target.value + myanmar + arabicUrdu + other + fallback);
  };
  const handleChangeMyanmar = (event) => {
    setMyanmarSelected(true);
    setSelectedMyanmarFontClass(event.target.value);
    setSelectedFontClass('fonts-' + hebrew + event.target.value + arabicUrdu + other + fallback);
  };
  const handleChangeArabicUrdu = (event) => {
    setArabicUrduSelected(true);
    setSelectedArabicUrduFontClass(event.target.value);
    setSelectedFontClass('fonts-' + hebrew + myanmar + event.target.value + other + fallback);
  };
  const handleChangeOther = (event) => {
    setOtherSelected(true);
    setSelectedOtherFontClass(event.target.value);
    setSelectedFontClass('fonts-' + hebrew + myanmar + arabicUrdu + event.target.value + fallback);
  };
  const handleChangeFallback = (event) => {
    setFallbackSelected(true);
    setSelectedFallbackFontClass(event.target.value);
    setSelectedFontClass('fonts-' + hebrew + myanmar + arabicUrdu + other + event.target.value);
  };

  const webFontsSelectableHebrew = [
    { name: 'Ezra SIL 2.51', id: 'Pankosmia-EzraSIL' },
    { name: 'Ezra SIL SR 2.51', id: 'Pankosmia-EzraSILSR' },
    { name: '- ' + doI18n("pages:core-local-workspace:other-fallback", i18n) + ' -', id: '' },
  ];

  const webFontsSelectableMyanmar = [
    { name: 'Padauk 5.100', id: 'Pankosmia-Padauk' },
    { name: 'Padauk Book 5.100', id: 'Pankosmia-PadaukBook' },
    { name: '- ' + doI18n("pages:core-local-workspace:other-fallback", i18n) + ' -', id: '' },
  ];

  const webFontsSelectableArabicUrdu = [
    { name: 'Awami Nastaliq 3.300*', id: 'Pankosmia-AwamiNastaliqPankosmia-NotoNastaliqUrdu' },
    { name: 'Awami Nastaliq Medium 3.300*', id: 'Pankosmia-AwamiNastaliqMediumPankosmia-NotoNastaliqUrdu' },
    { name: 'Awami Nastaliq Semi Bold 3.300*', id: 'Pankosmia-AwamiNastaliqSemiBoldPankosmia-NotoNastaliqUrdu' },
    { name: 'Awami Nastaliq Extra Bold 3.300*', id: 'Pankosmia-AwamiNastaliqExtraBoldPankosmia-NotoNastaliqUrdu' },
    { name: 'Noto Naskh Arabic 2022', id: 'Pankosmia-NotoNaskhArabic' },
    { name: '- ' + doI18n("pages:core-local-workspace:other-fallback", i18n) + ' -', id: '' },
  ];
  
  const webFontsSelectableOther = [
    { name: 'Andika 6.200', id: 'Pankosmia-Andika' },
    { name: 'Cardo 2011', id: 'Pankosmia-Cardo' },
    { name: 'Charis SIL 6.200', id: 'Pankosmia-CharisSIL' },
    { name: 'Open Sans 2020', id: 'Pankosmia-OpenSans' },
    { name: 'Roboto 2004', id: 'Pankosmia-Roboto' },
    { name: 'Roboto Black 2004', id: 'Pankosmia-RobotoBlack' },
    { name: 'Roboto Light 2004', id: 'Pankosmia-RobotoLight' },
    { name: 'Roboto Medium 2004', id: 'Pankosmia-RobotoMedium' },
    { name: 'Roboto Thin 2004', id: 'Pankosmia-RobotoThin' },
    { name: '- ' + doI18n("pages:core-local-workspace:fallback", i18n) + ' -', id: '' },
  ];

  const webFontsSelectableFallback = [
    { name: 'Gentium Plus 6.200', id: 'Pankosmia-GentiumPlus' },
    { name: 'Gentium Book Plus 6.200', id: 'Pankosmia-GentiumBookPlus' },
  ];

  const WebFontsSelectableHebrew =
    webFontsSelectableHebrew.map((font, index) => (
        <MenuItem key={index} value={font.id} dense>
            <FontMenuItem font={font}/>
        </MenuItem>
    ));

  const WebFontsSelectableMyanmar =
    webFontsSelectableMyanmar.map((font, index) => (
        <MenuItem key={index} value={font.id} dense>
            <FontMenuItem font={font}/>
        </MenuItem>
    ));

  const WebFontsSelectableArabicUrdu =
    webFontsSelectableArabicUrdu.map((font, index) => (
        <MenuItem key={index} value={font.id} dense>
            <FontMenuItem font={font}/>
        </MenuItem>
    ));

  const WebFontsSelectableOther =
    webFontsSelectableOther.map((font, index) => (
        <MenuItem key={index} value={font.id} dense>
            <FontMenuItem font={font}/>
        </MenuItem>
    ));

  const WebFontsSelectableFallback =
    webFontsSelectableFallback.map((font, index) => (
        <MenuItem key={index} value={font.id} dense>
            <FontMenuItem font={font}/>
        </MenuItem>
    ));

  return (
    <Grid2 container spacing={2}>
      <Grid2>
        <div item style={{maxWidth: 170, padding: "1.25em 0"}}>
            <Box sx={{minWidth: 170}}>
                <FormControl fullWidth style={{maxWidth: 300}} size="small">
                    <InputLabel id="select-hebrew-font-label" htmlFor="select-hebrew-font-id" sx={sx.inputLabel}>
                      {doI18n("pages:core-local-workspace:select_hebrewscriptfont", i18n)}
                    </InputLabel>
                    <Select
                        variant="outlined"
                        labelId="select-hebrew-font-label"
                        name="select-hebrew-font-name"
                        inputProps={{
                            id: "select-hebrew-font-id",
                        }}
                        value={hebrew}
                        label={doI18n("pages:core-local-workspace:select_hebrewscriptfont", i18n)}
                        onChange={handleChangeHebrew}
                        sx={sx.select}
                    >
                      {WebFontsSelectableHebrew}
                    </Select>
                </FormControl>
            </Box>
        </div>
      </Grid2>
      <Grid2>
        <div item style={{maxWidth: 185, padding: "1.25em 0"}}>
            <Box sx={{minWidth: 185}}>
                <FormControl fullWidth style={{maxWidth: 300}} size="small">
                    <InputLabel id="select-myanmar-font-label" htmlFor="select-myanmar-font-id" sx={sx.inputLabel}>
                      {doI18n("pages:core-local-workspace:select_myanmarscriptfont", i18n)}
                    </InputLabel>
                    <Select
                        variant="outlined"
                        labelId="select-myanmar-font-label"
                        name="select-myanmar-font-name"
                        inputProps={{
                            id: "select-myanmar-font-id",
                        }}
                        value={myanmar}
                        label={doI18n("pages:core-local-workspace:select_myanmarscriptfont", i18n)}
                        onChange={handleChangeMyanmar}
                        sx={sx.select}
                    >
                      {WebFontsSelectableMyanmar}
                    </Select>
                </FormControl>
            </Box>
        </div>
      </Grid2>
      <Grid2>
        <div item style={{maxWidth: 275, padding: "1.25em 0 0 0"}}>
            <Box sx={{minWidth: 275}}>
                <FormControl fullWidth style={{maxWidth: 300}} size="small">
                    <InputLabel id="select-arabic-urdu-font-label" htmlFor="select-arabic-urdu-font-id" sx={sx.inputLabel}>
                      {doI18n("pages:core-local-workspace:select_arabicurduscriptfont", i18n)}
                    </InputLabel>
                    <Select
                        variant="outlined"
                        labelId="select-arabic-urdu-font-label"
                        name="select-arabic-urdu-font-name"
                        inputProps={{
                            id: "select-arabic-urdu-font-id",
                        }}
                        value={arabicUrdu}
                        label={doI18n("pages:core-local-workspace:select_arabicurduscriptfont", i18n)}
                        onChange={handleChangeArabicUrdu}
                        sx={sx.select}
                    >
                      {WebFontsSelectableArabicUrdu}
                    </Select>
                    <FormHelperText>{doI18n("pages:core-local-workspace:replaceawamiifnotfirefox", i18n)}</FormHelperText>
                </FormControl>
            </Box>
        </div>
      </Grid2>
      <Grid2>
        <div item style={{maxWidth: 200, padding: "1.25em 0"}}>
            <Box sx={{minWidth: 200}}>
                <FormControl fullWidth style={{maxWidth: 300}} size="small">
                    <InputLabel id="select-other-font-label" htmlFor="select-other-font-id" sx={sx.inputLabel}>
                      {doI18n("pages:core-local-workspace:select_otherscriptfont", i18n)}
                    </InputLabel>
                    <Select
                        variant="outlined"
                        labelId="select-other-font-label"
                        name="select-other-font-name"
                        inputProps={{
                            id: "select-other-font-id",
                        }}
                        value={other}
                        label={doI18n("pages:core-local-workspace:select_otherscriptfont", i18n)}
                        onChange={handleChangeOther}
                        sx={sx.select}
                    >
                      {WebFontsSelectableOther}
                    </Select>
                </FormControl>
            </Box>
        </div>
      </Grid2>
      <Grid2>
        <div item style={{maxWidth: 225, padding: "1.25em 0"}}>
            <Box sx={{minWidth: 225}}>
                <FormControl fullWidth style={{maxWidth: 300}} size="small">
                    <InputLabel id="select-fallback-font-label" htmlFor="select-fallback-font-id" sx={sx.inputLabel}>
                      {doI18n("pages:core-local-workspace:select_fallbackscriptfont", i18n)}
                    </InputLabel>
                    <Select
                        variant="outlined"
                        labelId="select-fallback-font-label"
                        name="select-fallback-font-name"
                        inputProps={{
                            id: "select-fallback-font-id",
                        }}
                        value={fallback}
                        label={doI18n("pages:core-local-workspace:select_fallbackscriptfont", i18n)}
                        onChange={handleChangeFallback}
                        sx={sx.select}
                    >
                      {WebFontsSelectableFallback}
                    </Select>
                </FormControl>
            </Box>
        </div>
      </Grid2>
    </Grid2>
  );
}

PithekosToolbarSelectFont.propTypes = {
    /** Selected Font Set CSS Name */
    selectedFontClass: PropTypes.string,
    /** Set Selected Font Set CSS Name */
    setSelectedFontClass: PropTypes.func.isRequired,
};