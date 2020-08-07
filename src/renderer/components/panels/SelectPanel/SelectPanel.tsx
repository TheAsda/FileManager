import React, { useEffect } from 'react';
import './style.css';
import { useHotKeys } from '@fm/hooks';

interface SelectPanelProps {
  onSelect: () => void;
  text: string | number;
  hotkey: string;
}

const SelectPanel = (props: SelectPanelProps) => {
  const { setGlobalHotKeys, removeGlobalHotKeys } = useHotKeys();

  useEffect(() => {
    console.log('Bind ' + props.hotkey);

    setGlobalHotKeys({ [props.hotkey]: props.onSelect }, true);

    return () => {
      console.log('Unbind ' + props.hotkey);
      removeGlobalHotKeys([props.hotkey]);
    };
  }, [props.hotkey]);

  return (
    <div className="select-panel" onClick={props.onSelect}>
      {props.text}
    </div>
  );
};

export { SelectPanel, SelectPanelProps };
