import React from 'react';
import './style.css';
import { HotKeysWrapper } from '@fm/components';

interface SelectPanelProps {
  onSelect: () => void;
  text: string | number;
  hotkey: string;
}

const SelectPanel = (props: SelectPanelProps) => {
  return (
    <HotKeysWrapper
      handlers={{ [props.hotkey]: props.onSelect }}
      keyMap={{ [props.hotkey]: props.hotkey }}
    >
      <div className="select-panel" onClick={props.onSelect}>
        {props.text}
      </div>
    </HotKeysWrapper>
  );
};

export { SelectPanel, SelectPanelProps };
