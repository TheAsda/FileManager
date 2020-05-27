import React, { useState, useEffect, useMemo } from 'react';
import { useView } from '@fm/hooks';
import { Reader, FileInfo } from '@fm/explorer';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { useCache, useKeymap } from '@fm/hooks';
import { StateLine } from './StateLine';
import { clamp } from 'lodash';

const Window = () => {
  const { setKeybindings, unsetKeybindings } = useKeymap();
  const { updateStorage, getCached } = useCache();
  const { view, setDetailsView, setFolderView } = useView();
  const [selected, setSelected] = useState<number>(0);
  const [dir, setDir] = useState<string[]>(['D:', 'FileManagerTest']);
  const dirString = dir.reduce((acc, cur) => acc + cur + '/', '');

  let cachedFolder = useMemo(() => {
    console.log('Memo');
    return getCached(dirString);
  }, [dirString]);
  let dirState: FileInfo[];

  if (cachedFolder === null) {
    console.log('No cached');
    dirState = Reader.getCurrentDir(dirString);
    updateStorage(dirString, dirState);
  } else {
    console.log('Cached');
    dirState = cachedFolder;
  }

  useEffect(() => {
    console.log('Effect triggered');
    setKeybindings([
      {
        key: 'down',
        Action: (e) => {
          e.preventDefault();
          if (selected < dirState.length - 1) {
            setSelected(selected + 1);
          }
        },
      },
      {
        key: 'up',
        Action: (e) => {
          e.preventDefault();
          if (selected > 0) {
            setSelected(selected - 1);
          }
        },
      },
      {
        key: 'enter',
        Action: () => {
          if (dirState[selected].type === 'folder') {
            setDir([...dir, dirState[selected].name]);
            setSelected(0);
          }
        },
      },
      {
        key: 'backspace',
        Action: () => {
          if (dir.length > 1) {
            setDir([...dir.slice(0, dir.length - 1)]);
            setSelected(0);
          }
        },
      },
      {
        key: 'ctrl+down',
        Action: () => {
          setSelected(clamp(selected + 10, 0, dirState.length));
        },
      },
      {
        key: 'ctrl+up',
        Action: () => {
          setSelected(clamp(selected - 10, 0, dirState.length));
        },
      },
    ]);
    return () => {
      unsetKeybindings(['down', 'up', 'enter', 'backspace']);
    };
  }, [selected, dir]);

  return (
    <div className="window">
      <PathLine path={dirString} />
      {view === 'detail' ? (
        <DetailView data={dirState} selectedIndex={selected} />
      ) : null}
      <StateLine count={dirState.length} />
    </div>
  );
};

export { Window };
