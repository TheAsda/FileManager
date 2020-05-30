import { FileInfo } from '@fm/common';
import { useCache, useView, useManagers } from '@fm/hooks';
import { clamp } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { StateLine } from './StateLine';

const Explorer = () => {
  const { directoryManager } = useManagers();
  const { updateStorage, getCached } = useCache();
  const { view, setDetailsView, setFolderView } = useView();
  const [selected, setSelected] = useState<number>(0);
  const [dir, setDir] = useState<string[]>(['D:', 'FileManagerTest']);
  const dirString = dir.reduce((acc, cur) => acc + cur + '/', '');
  const [dirState, setDirState] = useState<FileInfo[]>([]);
  useEffect(() => {
    directoryManager
      .listDirectory(dir.join('/'))
      .then((data) => setDirState(data));
  }, [dir]);

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

export { Explorer };
