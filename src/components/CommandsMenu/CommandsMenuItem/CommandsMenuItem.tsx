import React from 'react';
import './style.css';

interface CommandsMenuItemProps {
  name: string;
  Action?: () => void;
  shortcut?: string;
  selected: boolean;
}

const CommandsMenuItem = (props: CommandsMenuItemProps) => {
  return (
    <div
      onClick={props.Action && props.Action}
      className={`commands-menu__item ${
        props.selected ? 'commands-menu__item--selected' : ''
      }`}
    >
      <div className="commands-menu__name">{props.name}</div>
      {props.shortcut && (
        <div className="commands-menu__shortcut">{props.shortcut}</div>
      )}
    </div>
  );
};

export { CommandsMenuItem, CommandsMenuItemProps };
