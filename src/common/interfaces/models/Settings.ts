import { Layout } from './Layout';

interface Settings {
  /** The name of the theme */
  theme: string;

  /** The log level that defines what types on messages to log */
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  /** Whether to show shidden items */
  showHidden: boolean;

  autoPreview: boolean;

  layout?: Layout;
}

export { Settings };
