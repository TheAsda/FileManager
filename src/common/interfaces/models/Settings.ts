interface TerminalSettings {
  fontSize: number;

  fontFamily: string;
}

interface Settings {
  /** The name of the theme */
  theme: string;

  terminal: TerminalSettings;
}

export { Settings };
