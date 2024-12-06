import { Toolbar } from "@mui/material";
import PithekosToolbarSelectFont from "./PithekosToolbarSelectFont";
// import sx from "./PithekosToolbar.styles"
import PropTypes from 'prop-types';

export default function PithekosToolbar(PithekosToolbarProps) {
  const {
    selectedFontsetName,
    setSelectedFontsetName,
  } = PithekosToolbarProps;
  
  const pithekosToolbarSelectFontProps = {
    selectedFontsetName,
    setSelectedFontsetName,
  };
  
  return (
    <div key="toolbar" style={{ color: "white", height: '54px', backgroundColor: "#ddcdee", width: '100%' }} >
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
  selectedFontsetName: PropTypes.string,
  /** Set Selected Font Set CSS Name */
  setSelectedFontsetName: PropTypes.func.isRequired,
};