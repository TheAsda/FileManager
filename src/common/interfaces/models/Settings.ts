interface TerminalSettings {
  fontSize: number;

  fontFamily: string;
}

interface Settings {
  /** The name of the theme */
  theme: string;

  terminal: TerminalSettings;

  /** The log level that defines what types on messages to log */
  logLevel: number | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  panelsGridSize: {
    xLength: number;
    yLength: number;
  };
}

export { Settings };
