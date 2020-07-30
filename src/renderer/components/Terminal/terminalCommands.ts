import { Commands } from '@fm/components';

interface TerminalCommands extends Commands {
  'Close panel': () => void;
  'Reload terminal': () => void;
}

export { TerminalCommands };
