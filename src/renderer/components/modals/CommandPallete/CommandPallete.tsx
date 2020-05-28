import React, { useState, useEffect } from 'react';
import './style.css';
import { CommandPalleteItem } from './CommandPalleteItem';

const CommandPallete = () => {
  const [selected, setSelected] = useState<number>(0);
  const MenuItems = [
    {
      name: 'New file',
      shortcut: 'Ctrl+N',
      Action: () => console.log('New File'),
    },
    {
      name: 'Rename',
      shortcut: 'F2',
    },
    {
      name: 'New folder',
      shortcut: 'F7',
    },
    {
      name: 'Delete',
      shortcut: 'Del',
    },
  ];

  return (
    <div className="commands-menu">
      {MenuItems.map((item, i) => (
        <CommandPalleteItem {...item} selected={i === selected} />
      ))}
    </div>
  );
};

export { CommandPallete };
