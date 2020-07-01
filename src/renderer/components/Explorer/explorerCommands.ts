import { Commands } from 'renderer/components/modals';

interface ExplorerCommands extends Commands {
  'New file': () => void;
  'New folder': () => void;
  'Rename item': () => void;
  'Delete item': () => void;
  'Send item to trash': () => void;
  'Close panel': () => void;
  'Reload directory': () => void;
  'Open in terminal': () => void;
}

export { ExplorerCommands };
