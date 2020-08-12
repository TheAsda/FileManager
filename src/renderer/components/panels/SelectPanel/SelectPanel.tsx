import React, { useEffect } from 'react';
import './style.css';
import { HotKeys } from 'react-hotkeys';

interface SelectPanelProps {
  onSelect: () => void;
  text: string | number;
  hotkey: string;
}

const SelectPanel = (props: SelectPanelProps) => {
  // useEffect(() => {
  //   console.log('Bind ' + props.hotkey);

  //   setGlobalHotKeys({ [props.hotkey]: props.onSelect }, true);

  //   return () => {
  //     console.log('Unbind ' + props.hotkey);
  //     removeGlobalHotKeys([props.hotkey]);
  //   };
  // }, [props.hotkey]);

  return (
    <HotKeys
      keyMap={{ [props.hotkey]: props.hotkey }}
      handlers={{ [props.hotkey]: props.onSelect }}
    >
      <div className="select-panel" onClick={props.onSelect}>
        {props.text}
      </div>
    </HotKeys>
  );
};

export { SelectPanel, SelectPanelProps };
