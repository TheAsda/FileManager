import React, { useEffect } from 'react';
import { bind, unbind } from 'mousetrap';
import './style.css';

interface SelectPanelProps {
  onSelect: () => void;
  text: string | number;
  hotkey: string;
}

const SelectPanel = (props: SelectPanelProps) => {
  useEffect(() => {
    console.log('Bind ' + props.hotkey);

    bind(props.hotkey, props.onSelect);

    return () => {
      console.log('Unbind ' + props.hotkey);
      unbind(props.hotkey);
    };
  }, [props.hotkey]);

  return (
    <div className="select-panel" onClick={props.onSelect}>
      {props.text}
    </div>
  );
};

export { SelectPanel, SelectPanelProps };
