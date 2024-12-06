import React, { useState } from 'react';
import TextTranslationEditorMuncher from "../../munchers/TextTranslation/TextTranslationEditorMuncher";
import TextTranslationViewerMuncher from "../../munchers/TextTranslation/TextTranslationViewerMuncher";
import BcvNotesViewerMuncher from "../../munchers/BcvNotes/BcvNotesViewerMuncher";
import TastelessMuncher from "../../munchers/Tasteless/TastelessMuncher";
import './tiles_styles.css'
import VideoLinksViewerMuncher from "../../munchers/VideoLinks/VideoLinksViewerMuncher";
import PithekosToolbar from "../../components/PithekosToolbar";

function WorkspaceCard({metadata, style, systemBcv, setSystemBcv, enableNet}) {
    const scriptDirectionString =  metadata.script_direction === 'rtl' ? 'rtl' : 'ltr';
    const [selectedFontsetName, setSelectedFontsetName] = useState('gentiumplus');
    const pithekosToolbarProps = {
      selectedFontsetName,
      setSelectedFontsetName,
    };
    if (metadata.primary && metadata.flavor === "textTranslation") {
        return <div style={style} dir={scriptDirectionString}>
          <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
          <div class={selectedFontsetName}>
            <TextTranslationEditorMuncher
                metadata={metadata}
                systemBcv={systemBcv}
                setSystemBcv={setSystemBcv}
            />
          </div>
        </div>
    }
    if (metadata.flavor === "textTranslation") {
        return <div style={style} dir={scriptDirectionString}>
          <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
            <div class={selectedFontsetName}>
              <TextTranslationViewerMuncher
                  metadata={metadata}
                  systemBcv={systemBcv}
                  setSystemBcv={setSystemBcv}
              />
            </div>
          </div>
    }
    if (metadata.flavor.toLowerCase() === "x-bcvnotes") {
        return <div style={style} dir={scriptDirectionString}>
          <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
            <div class={selectedFontsetName}>
              <BcvNotesViewerMuncher
                  metadata={metadata}
                  systemBcv={systemBcv}
              />
            </div>
          </div>
    }
    if (metadata.flavor === "x-videolinks") {
        return <div style={style} dir={scriptDirectionString}>
          <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
            <div class={selectedFontsetName}>
              <VideoLinksViewerMuncher
                  metadata={metadata}
                  systemBcv={systemBcv}
                  enableNet={enableNet}
              />
            </div>
          </div>
    }
    // DO NOT REMOVE! Fallback so that an element is always returned
    return <div style={style} dir={scriptDirectionString}>
      <PithekosToolbar key="pithekos toolbar" {...pithekosToolbarProps} />
        <div class={selectedFontsetName}>
          <TastelessMuncher
              metadata={metadata}
              systemBcv={systemBcv}
          />
        </div>
      </div>
}

export default WorkspaceCard;