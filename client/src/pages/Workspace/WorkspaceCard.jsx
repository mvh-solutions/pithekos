import TextTranslationEditorMuncher from "../../munchers/TextTranslation/TextTranslationEditorMuncher";
import BcvNotesViewerMuncher from "../../munchers/BcvNotes/BcvNotesViewerMuncher";
import TastelessMuncher from "../../munchers/Tasteless/TastelessMuncher";
import React from "react";
import './tiles_styles.css'
import VideoLinksViewerMuncher from "../../munchers/VideoLinks/VideoLinksViewerMuncher";

function WorkspaceCard({metadata, style, systemBcv, setSystemBcv}) {
    if (metadata.primary && metadata.flavor === "textTranslation") {
        return <div style={style}>
            <TextTranslationEditorMuncher
                metadata={metadata}
                systemBcv={systemBcv}
                setSystemBcv={setSystemBcv}
            />
        </div>
    }
    if (metadata.flavor.toLowerCase() === "x-bcvnotes") {
        return <div style={style}>
            <BcvNotesViewerMuncher
                metadata={metadata}
                systemBcv={systemBcv}
            />
        </div>
    }
    if (metadata.flavor === "x-videolinks") {
        return <div style={style}>
            <VideoLinksViewerMuncher
                metadata={metadata}
                systemBcv={systemBcv}
            />
        </div>
    }
    // DO NOT REMOVE! Fallback so that an element is always returned
    return <div style={style}>
        <TastelessMuncher
            metadata={metadata}
            systemBcv={systemBcv}
        />
    </div>
}

export default WorkspaceCard;