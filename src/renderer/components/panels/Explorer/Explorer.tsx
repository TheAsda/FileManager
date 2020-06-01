import { FileInfo } from '@fm/common';
import { useCache, useView, useManagers } from '@fm/hooks';
import React, { useEffect, useState } from 'react';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { StateLine } from './StateLine';
import { reduce, clamp, noop } from 'lodash';
import { HotKeys } from 'react-hotkeys';

const Explorer = () => {
  const { directoryManager, keysManager } = useManagers();
  const { updateStorage, getCached } = useCache();
  const { view, setDetailsView, setFolderView } = useView();
  const [selected, setSelected] = useState<number>(0);
  const [dir, setDir] = useState<string[]>(['D:']);
  const dirString = reduce(dir, (acc, cur) => acc + cur + '/', '');
  const [dirState, setDirState] = useState<FileInfo[]>([]);
  useEffect(() => {
    const cachedDirState = getCached(dirString);
    if (cachedDirState === null) {
      directoryManager.listDirectory(dirString).then((data) => {
        updateStorage(dirString, data);
        setDirState(data);
      });
    } else {
      setDirState(cachedDirState);
    }
  }, [dir]);

  const selectNextItem = () => {
    setSelected((state) => clamp(state + 1, 0, dirState.length));
  };

  const selectPreviousItem = () => {
    setSelected((state) => clamp(state - 1, 0, dirState.length));
  };

  const exitDirectory = () => {
    setDir((state) => {
      if (state.length > 1) {
        setSelected(0);
        return state.slice(0, state.length - 1);
      }

      return state;
    });
  };

  const enterDirectory = () => {
    setDir((state) => {
      if (dirState[selected].attributes.directory) {
        setSelected(0);
        return [...state, dirState[selected].name];
      }

      return state;
    });
  };

  const createFile = noop;

  const createFolder = noop;

  const rename = noop;

  const del = noop;

  const sendToTrash = noop;

  const handlers = {
    moveDown: selectNextItem,
    moveUp: selectPreviousItem,
    moveBack: exitDirectory,
    openDirectory: enterDirectory,
    newFile: createFile,
    newFolder: createFolder,
    rename: rename,
    delete: del,
    sendToTrash: sendToTrash,
  };

  return (
    <div className="window">
      <HotKeys keyMap={keysManager.getKeyMap()} handlers={handlers}>
        <PathLine path={dirString} />
        {view === 'detail' ? (
          <DetailView data={dirState} selectedIndex={selected} />
        ) : null}
        <StateLine count={dirState.length} />
      </HotKeys>
    </div>
  );
};

export { Explorer };
