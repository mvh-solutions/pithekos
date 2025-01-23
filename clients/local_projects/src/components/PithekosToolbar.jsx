import { Toolbar } from "@mui/material";
import PithekosToolbarSelectFont from "./PithekosToolbarSelectFont";
// import sx from "./PithekosToolbar.styles"
import PropTypes from 'prop-types';

export default function PithekosToolbar(PithekosToolbarProps) {
  const {
    selectedFontClass,
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
  } = PithekosToolbarProps;
  
  const pithekosToolbarSelectFontProps = {
    selectedFontClass,
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
  };
  
  return (
    <div key="toolbar" style={{ color: "white", backgroundColor: "#ddcdee", width: '100%' }} >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div style={{ textAlign: "center", fontSize: '10px'  }} key="font-menu">
          <PithekosToolbarSelectFont {...pithekosToolbarSelectFontProps} />
        </div>
      </Toolbar>
    </div>
  );
}

PithekosToolbar.propTypes = {
  /** Selected Font Set CSS Name */
  selectedFontClass: PropTypes.string,
  /** Set Selected Font Set CSS Name */
  setSelectedFontClass: PropTypes.func.isRequired,
};