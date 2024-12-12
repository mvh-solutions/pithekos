import { PropTypes } from "prop-types";
import { Typography } from "@mui/material";

export default function FontMenuItem(fontMenuItemProps) {
  const { font } = fontMenuItemProps;

  const styles = {
    menuItem: {
      width: "13rem",
      display: "flex",
      justifyContent: "space-between",
    },
  };

  return (
    <div style={(styles.menuItem, { borderBottom: "1px outset" })}>
      <div
        style={styles.menuItem}
      >
        <Typography variant="body2" component="div">
          {font.fullname}&nbsp;
        </Typography>
        <Typography
          style={{ width: "100%", fontFamily: font.name }}
          noWrap
          variant="body2"
          component="div"
        >
          {font.fullname}
        </Typography>
      </div>
    </div>
  );
}

FontMenuItem.propTypes = {
  font: PropTypes.shape({
    fullname: PropTypes.string,
    name: PropTypes.string,
  }),
};