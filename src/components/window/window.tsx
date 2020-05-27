import React, { useState } from 'react';
import { useView } from '@fm/hooks';
import { Reader, FileInfo } from '@fm/explorer';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { useCache } from '@fm/hooks';

const Window = () => {
  const { updateStorage, getCached } = useCache();
  const { view, setDetailsView, setFolderView } = useView();
  const [selected, setSelected] = useState<number>(0);
  const [dir, setDir] = useState<string[]>(['D:', 'FileManagerTest']);
  const dirString = dir.reduce((acc, cur) => acc + cur + '/', '');
  const dirState = getCached(dirString) ?? Reader.getCurrentDir(dirString);

  return (
    <div className="window">
      <PathLine path={dirString} />
      {view === 'detail' ? (
        <DetailView data={dirState} selectedIndex={selected} />
      ) : null}
    </div>
  );
};

export { Window };
