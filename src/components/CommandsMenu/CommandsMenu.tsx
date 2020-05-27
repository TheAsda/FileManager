import React, { useState, useEffect } from 'react';
import { CommandsMenuItemProps, CommandsMenuItem } from './CommandsMenuItem';
import { useKeymap } from '@fm/hooks';
import './style.css';

const CommandsMenu = () => {
  const { setKeybindings, unsetKeybindings } = useKeymap();
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

  useEffect(() => {
    console.log('Set menu keybindings');
    setKeybindings([
      {
        key: 'down',
        Action: () => {
          console.log(selected);
          if (selected < MenuItems.length - 1) {
            setSelected((state) => state + 1);
          }
        },
      },
      {
        key: 'up',
        Action: () => {
          if (selected > 0) {
            setSelected((state) => state - 1);
          }
        },
      },
      {
        key: 'enter',
        Action: () => {
          if (MenuItems[selected].Action !== undefined) {
            MenuItems[selected].Action();
          }
        },
      },
    ]);
    return () => {
      unsetKeybindings(['down', 'up']);
    };
  }, [selected, setSelected]);

  return (
    <div className="commands-menu">
      {MenuItems.map((item, i) => (
        <CommandsMenuItem {...item} selected={i === selected} />
      ))}
    </div>
  );
};

export { CommandsMenu };
