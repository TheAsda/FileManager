import { CommandsMenu } from '@fm/components';
import { FileInfo, Reader } from '@fm/explorer';
import { useCache, useKeymap, useView } from '@fm/hooks';
import { clamp } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { StateLine } from './StateLine';

const Explorer = () => {
  const { setKeybindings, unsetKeybindings } = useKeymap();
  const { updateStorage, getCached } = useCache();
  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
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
    if (!menuVisibility) {
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
        {
          key: 'ctrl+shift+p',
          Action: () => {
            setMenuVisibility((state) => !state);
          },
        },
        {
          key: 'f1',
          Action: () => {
            setMenuVisibility((state) => !state);
          },
        },
      ]);
    }
    return () => {
      unsetKeybindings(['down', 'up', 'enter', 'backspace']);
    };
  }, [selected, dir, setMenuVisibility, menuVisibility]);

  return (
    <div className="window">
      {menuVisibility && <CommandsMenu />}
      <PathLine path={dirString} />
      {view === 'detail' ? (
        <DetailView data={dirState} selectedIndex={selected} />
      ) : null}
      <StateLine count={dirState.length} />
    </div>
  );
};

export { Explorer };
