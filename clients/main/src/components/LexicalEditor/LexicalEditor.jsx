import React, {
  useState, useRef, useMemo, useEffect,
} from 'react';
import {
  Editor, getViewOptions, DEFAULT_VIEW_MODE,
} from '@biblionexus-foundation/scribe-editor';

export default function LexicalEditor({
  usjInput, onUsjChange, selectedFont, fontSize, textDirection, scrRef, setScrRef, setUsjInput,
}) {
    const editorRef = useRef(null);

  const [viewMode] = useState(DEFAULT_VIEW_MODE);
  const viewOptions = useMemo(() => getViewOptions(viewMode), [viewMode]);

  // console.log('usjInput',usjInput);
  return (
    <div className="flex-grow flex flex-col overflow-hidden" onInput={setUsjInput}>
      <div className="flex-grow flex flex-col bg-gray-100 overflow-hidden awami">
        {usjInput && <Editor
          usjInput={usjInput}
          ref={editorRef}
          onChange={onUsjChange}
          viewOptions={viewOptions}
          scrRef={scrRef}
          setScrRef={setScrRef}
          textDirection={textDirection}
          font={selectedFont}
          fontSize={fontSize}
        />}
      </div>
    </div>
  );
}
