import React from 'react';
import './style.css';

interface SelectPanelProps {
  onSelect: () => void;
  text: string | number;
  hotkey: string;
}

const SelectPanel = (props: SelectPanelProps) => {
  return (
    <div className="select-panel" onClick={props.onSelect}>
      {props.text}
    </div>
  );
};

export { SelectPanel, SelectPanelProps };
