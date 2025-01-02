export const sx = {
  select: {
      /** '.MuiOutlinedInput-notchedOutline': { borderColor: 'pink'},
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'pink', borderWidth: '0.15rem'}, */
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: "pink", borderWidth: "thin"},
      height: '32px',
      background: 'white',
      fontSize: '1.2em',
  },
  inputLabel: {
    background: 'purple',
    color: 'white',
    "&.Mui-focused": {color: "#8DD6E0"},
  },
}

export default sx;