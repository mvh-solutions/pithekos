import { ImPilcrow } from 'react-icons/im';
import { RiInputCursorMove } from 'react-icons/ri';
import {
  MdOutlineUndo,
  MdOutlineRedo,
  MdSave,
  MdViewAgenda,
  MdKeyboardCommandKey,
} from 'react-icons/md';

import {
  ContextMenuTriggerButton,
  EnhancedCursorToggleButton,
  FormatButton,
  HistoryButtons,
  MarkerInfo,
  SaveButton,
  ScriptureReferenceInfo,
  ToolbarContainer,
  ToolbarSection,
  ViewButton,
} from '@scriptural/react';

export function CustomToolbar({ onSave }) {
  return (
    <ToolbarContainer>
      <ToolbarSection>
        <HistoryButtons
          undoIconComponent={<MdOutlineUndo size={20} />}
          redoIconComponent={<MdOutlineRedo size={20} />}
        />
        <hr />
        <SaveButton onSave={onSave} saveIconComponent={<MdSave size={20} />} />
        <hr />
        <ViewButton viewIconComponent={<MdViewAgenda size={16} />} />
        <FormatButton formatIconComponent={<ImPilcrow />} />
        <EnhancedCursorToggleButton
          enhancedCursorIconComponent={<RiInputCursorMove size={18} />}
        />
        <hr />
      </ToolbarSection>
      <ToolbarSection>
        <ContextMenuTriggerButton
          contextMenuTriggerIconComponent={<MdKeyboardCommandKey size={18} />}
        />
        <MarkerInfo />
        <ScriptureReferenceInfo />
        <hr />
      </ToolbarSection>
    </ToolbarContainer>
  );
}