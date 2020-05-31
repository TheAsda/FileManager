import React, { useState } from 'react';
import './style.css';
import { CommandPalleteItem } from './CommandPalleteItem';
import { map } from 'lodash';

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
      {map(MenuItems, (item, i) => (
        <CommandPalleteItem {...item} selected={i === selected} />
      ))}
    </div>
  );
};

export { CommandPallete };
