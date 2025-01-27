import React, { useState } from 'react';
import TextTranslationEditorMuncher from "../../munchers/TextTranslation/TextTranslationEditorMuncher";
import TextTranslationViewerMuncher from "../../munchers/TextTranslation/TextTranslationViewerMuncher";
import BcvNotesViewerMuncher from "../../munchers/BcvNotes/BcvNotesViewerMuncher";
import TastelessMuncher from "../../munchers/Tasteless/TastelessMuncher";
import './tiles_styles.css'
import VideoLinksViewerMuncher from "../../munchers/VideoLinks/VideoLinksViewerMuncher";

function WorkspaceCard({metadata, style}) {
    const scriptDirectionString =  metadata.script_direction === 'rtl' ? 'rtl' : 'ltr';
    if (metadata.primary && metadata.flavor === "textTranslation") {
        return <div style={style} dir={scriptDirectionString}>
          <TextTranslationEditorMuncher
            metadata={metadata}
          />
        </div>
    }
    if (metadata.flavor === "textTranslation") {
        return <div style={style} dir={scriptDirectionString}>
          <TextTranslationViewerMuncher
              metadata={metadata}
          />
        </div>
  }
    if (metadata.flavor.toLowerCase() === "x-bcvnotes") {
        return <div style={style} dir={scriptDirectionString}>
          <BcvNotesViewerMuncher
              metadata={metadata}
          />
        </div>
    }
    if (metadata.flavor === "x-videolinks") {
        return <div style={style} dir={scriptDirectionString}>
          <VideoLinksViewerMuncher
              metadata={metadata}
          />
        </div>
    }
    // DO NOT REMOVE! Fallback so that an element is always returned
    return <div style={style} dir={scriptDirectionString}>
      <TastelessMuncher
          metadata={metadata}
      />
    </div>
}

export default WorkspaceCard;