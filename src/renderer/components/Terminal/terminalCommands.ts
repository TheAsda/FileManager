import { Commands } from 'renderer/components/modals';

interface TerminalCommands extends Commands {
  'Close panel': () => void;
  'Reload terminal': () => void;
}

export { TerminalCommands };
