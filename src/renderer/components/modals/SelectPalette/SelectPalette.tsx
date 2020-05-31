import React, { useState, useEffect } from 'react';
import { clamp, map, filter, findIndex, clone } from 'lodash';
import { HotKeys, KeyMap } from 'react-hotkeys';
import './style.css';
import { SelectPaletteItem } from './SelectPaletteItem';

interface SelectPaletteProps {
  options: string[];
  inputValue?: string;
  onSelect: (selectedItem: string) => void;
  onClose: () => void;
  isOpened: boolean;
}

const SelectPalette = (props: SelectPaletteProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>(props.inputValue ?? '');

  const selectNextItem = () => {
    setSelectedIndex((index) => clamp(index + 1, 0, props.options.length - 1));
  };

  const selectPreviousItem = () => {
    setSelectedIndex((index) => clamp(index - 1, 0, props.options.length - 1));
  };

  const keyMap: KeyMap = {
    close: ['esc'],
    nextItem: ['down'],
    previousItem: ['up'],
    selectItem: ['enter'],
  };

  const handlers = {
    close: () => props.onClose(),
    nextItem: selectNextItem,
    previousItem: selectPreviousItem,
    selectItem: () => props.onSelect(props.options[selectedIndex]),
  };

  useEffect(() => {
    if (inputValue.length === 0) {
      return;
    }
    const regExp = new RegExp(inputValue, 'ig');
    const newIndex = findIndex(props.options, (item) => regExp.test(item));

    if (newIndex !== -1) {
      setSelectedIndex(newIndex);
    }
  }, [inputValue]);

  if (!props.isOpened) {
    return null;
  }

  return (
    <div className="select-palette">
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="select-palette__search"
        />
        {map(props.options, (option, i) => (
          <SelectPaletteItem
            command={option}
            selected={i === selectedIndex}
            key={option}
          />
        ))}
      </HotKeys>
    </div>
  );
};

export { SelectPalette };
