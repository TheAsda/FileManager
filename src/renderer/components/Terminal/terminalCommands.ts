import { Commands } from '@fm/common/interfaces/Commands';

interface TerminalCommands extends Commands {
  'Close panel': () => void;
  'Reload terminal': () => void;
}

export { TerminalCommands };
