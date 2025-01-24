import {useContext, useState, useEffect} from "react"
import {Grid2, Switch, Box} from "@mui/material";
import {debugContext, i18nContext, doI18n, getJson, getAndSetJson} from "pithekos-lib";
import PithekosToolbar from "./components/PithekosToolbar";

function App() {
    const {debugRef} = useContext(debugContext);
    const i18n = useContext(i18nContext);
    const [selectedHebrewFontClass, setSelectedHebrewFontClass] = useState('');
    const [selectedMyanmarFontClass, setSelectedMyanmarFontClass] = useState('');
    const [selectedArabicUrduFontClass, setSelectedArabicUrduFontClass] = useState('');
    const [selectedOtherFontClass, setSelectedOtherFontClass] = useState('');
    const [selectedFallbackFontClass, setSelectedFallbackFontClass] = useState('');
    const [selectedFontClass, setSelectedFontClass] = useState('');
    // const [activeFontClass, setActiveFontClass] = useState('');
    const [fontClass, setFontClass] = useState([]);
    useEffect(
      () => {
          getAndSetJson({
              url: "/settings/typography",
              setter: setFontClass
          }).then()},
      []
    );
    useEffect( () => {
      setSelectedFontClass(fontClass.font_class);
    },[fontClass.font_class]);

    const activeFontClass = fontClass.font_class;

    const pithekosToolbarProps = {
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
    };

    return (
            <Grid2 container>
                <Grid2 item size={2}>
                    <b>{doI18n("pages:core-settings:debug_prompt", i18n)}</b>
                </Grid2>
                <Grid2 item size={10}>
                    <Switch
                        checked={debugRef.current}
                        onChange={() =>
                            debugRef.current ?
                                getJson("/debug/disable", debugRef.current) :
                                getJson("/debug/enable", debugRef.current)
                        }
                    />
                </Grid2>
                <Grid2 item size={12}>
                  <Box sx={{ borderTop: 1 }}>
                    <br/>
                    <b>Active font_class:</b> {fontClass.font_class}<br/><br/>
                    <b>Change font_class:</b><br />
                    <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
                    {fontClass.font_class !== selectedFontClass &&
                      <Box sx={{ paddingLeft: "20pt" }}>
                        <em>Instructions:</em>
                        <ol>
                          <li>Change font_class in <em>~/pankosmia_working/user_settings.json</em>
                            <ul>
                              <li><b>from:</b> "font_class": "{fontClass.font_class}",</li>
                              <li><b>to:</b> "font_class": "{selectedFontClass}",</li>
                            </ul>
                          </li>
                          <li>Save <em>~/pankosmia_working/user_settings.json.</em></li>
                          <li>Restart the Pithekos web server.</li>
                          <li>Reopen <em>http://localhost:8000</em> in Firefox.</li>
                        </ol>
                      </Box>
                    }
                  </Box>
                </Grid2>
            </Grid2>
    )
}

export default App;
