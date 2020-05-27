import React, { useState } from 'react';
import { useView } from '@fm/hooks';
import { Reader } from '@fm/explorer';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';

const Window = () => {
  const { view, setDetailsView, setFolderView } = useView();
  const [selected, setSelected] = useState<number>(0);
  const [path, setPath] = useState<string[]>(['D:', 'FileManagerTest']);
  const pathString = path.reduce((acc, cur) => acc + cur + '/', '');

  const reader = new Reader();

  const dirState = reader.getCurrentDir(pathString);
  document.onkeydown = (e) => {
    e.preventDefault();
    console.log(e.key);
    switch (e.key) {
      case 'ArrowUp':
        if (selected > 0) {
          setSelected(selected - 1);
        }
        break;

      case 'ArrowDown':
        if (selected < dirState.length - 1) {
          setSelected(selected + 1);
        }
        break;

      case 'Enter':
        if (dirState[selected].type === 'folder') {
          setPath([...path, dirState[selected].name]);
          setSelected(0);
        }
        break;
      case 'Backspace':
        if (path.length > 1) {
          setPath(path.slice(0, path.length - 1));
          setSelected(0);
        }
        break;
    }
  };

  return (
    <div className="window">
      <PathLine path={pathString} />
      {view === 'detail' ? (
        <DetailView data={dirState} selectedIndex={selected} />
      ) : null}
    </div>
  );
};

export { Window };
