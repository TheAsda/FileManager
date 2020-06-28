import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { useManagers, useTerminals, useExplorers, usePreview } from '@fm/hooks';
import { PanelType } from '@fm/common';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import { Preview } from '../Preview';
import './style.css';

const Window = () => {
  const { directoryManager, keysManager } = useManagers();

  const { dispatch: terminalsAction } = useTerminals();
  const { dispatch: explorersAction } = useExplorers();
  const { data: preview, dispatch: previewAction } = usePreview();

  const previewHandler = (path: string) => {
    previewAction({
      type: 'display',
      path: path,
    });
  };

  const togglePreview = () => {
    if (preview.display) {
      previewAction({
        type: 'destroy',
      });
    } else {
      previewAction({
        type: 'display',
        path: null,
      });
    }
  };

  const onClose = (type: PanelType) => (index?: number | null) => {
    if (!index) {
      return;
    }

    switch (type) {
      case 'explorer': {
        explorersAction({
          type: 'destroy',
          index: index,
        });
        return;
      }
      case 'preview': {
        previewAction({
          type: 'destroy',
        });
        return;
      }
      case 'terminal': {
        terminalsAction({
          type: 'destroy',
          index: index,
        });
        return;
      }
    }
  };

  const switchPane = noop;

  const handlers = {
    switchPane,
    togglePreview,
  };

  return (
    <div className="window">
      <HotKeys className="hot-keys" handlers={handlers} keyMap={keysManager.getKeyMap()}>
        <SplitPanels splitType="vertical">
          <ExplorerPanels directoryManager={directoryManager} onPreview={previewHandler} />
          {preview.display && (
            <Preview onClose={onClose('preview')} path={preview.path} toggle={togglePreview} />
          )}
          <TerminalPanels />
        </SplitPanels>
      </HotKeys>
    </div>
  );
};

export { Window };
