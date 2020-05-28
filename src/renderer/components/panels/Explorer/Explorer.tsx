import { FileInfo, Reader } from '@fm/common';
import { useCache, useView } from '@fm/hooks';
import { clamp } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { StateLine } from './StateLine';

const Explorer = () => {
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
