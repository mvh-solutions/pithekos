import { ScripturalEditorComposer } from "@scriptural/react";
import { HistoryPlugin } from "@scriptural/react/internal-packages/shared-react/plugins/History/HistoryPlugin";
import "@scriptural/react/styles/scriptural-editor.css";
import "@scriptural/react/styles/nodes-menu.css";
import "./custom-editor.css";
import {
  CursorHandlerPlugin,
} from "@scriptural/react/plugins/CursorHandlerPlugin";
import { ScripturalNodesMenuPlugin } from "@scriptural/react/plugins/ScripturalNodesMenuPlugin";
import { DEFAULT_SCRIPTURAL_BASE_SETTINGS, useBaseSettings } from "@scriptural/react/plugins/BaseSettingsPlugin";

import { useMemo } from "react";
import { CustomToolbar } from "./CustomToolbar";

function onError(error) {
  console.error(error);
}

export default function Editor({
  usj,
  /** The lexical state to use as the initial state of the editor whe want to resume work from a previous editor session. */ 
  initialLexicalState,
  bookCode,
  editable = true,
  children,
  onSave,
  onHistoryChange,
}) {
  const initialConfig = useMemo(() => {
    return {
      bookCode,
      usj,
      onError,
      editable,
      initialLexicalState,
      initialSettings: {
        ...DEFAULT_SCRIPTURAL_BASE_SETTINGS,
        onSave,
      },
    };
  }, [usj, editable, bookCode, initialLexicalState, onSave]);

  return (
    <ScripturalEditorComposer initialConfig={initialConfig}>
      <EditorPlugins onSave={onSave} onHistoryChange={onHistoryChange}/>
      {children}
    </ScripturalEditorComposer>
  );
}

function EditorPlugins({ onSave, onHistoryChange }) {
  const { enhancedCursorPosition, contextMenuTriggerKey } = useBaseSettings();

  return (
    <>
      <CustomToolbar onSave={onSave}/>
      {enhancedCursorPosition && (
        <CursorHandlerPlugin
          updateTags={["history-merge"]}
          canContainPlaceHolder={(node) => node.getType() !== "graft"}
        />
      )}
      <ScripturalNodesMenuPlugin trigger={contextMenuTriggerKey} />
      <HistoryPlugin onChange={onHistoryChange}/>
    </>
  );
}