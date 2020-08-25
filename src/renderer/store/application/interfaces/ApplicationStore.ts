import { FileInfo } from '@fm/common';
import { TerminalStore } from './TerminalStore';
import { ExplorersStore } from './ExplorerStore';

interface ApplicationStore {
  settings: {
    autoPreview: boolean;
    showHidden: boolean;
    theme: string;
  };
  window: {
    width: number;
    height: number;
    sections: {
      explorer: { width: number };
      preview: { width: number };
      terminal: { width: number };
    };
  };
  explorers: {
    hidden: boolean;
    panel0?: ExplorersStore;
    panel1?: ExplorersStore;
  };
  terminals: {
    hidden: boolean;
    panel0?: TerminalStore;
    panel1?: TerminalStore;
  };
  preview: {
    hidden: boolean;
    item?: FileInfo;
  };
}

export { ApplicationStore };