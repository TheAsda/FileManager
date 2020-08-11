import { ISettingsStore } from './interfaces/ISettingsStore';
import Store, { Schema } from 'electron-store';
import { Settings } from '@fm/common';

const settingsSchema: Schema<Settings> = {
  autoPreview: {
    type: 'boolean',
    default: false,
  },
  theme: {
    type: 'string',
    default: 'default',
  },
  logLevel: {
    type: 'string',
    enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
  },
  showHidden: {
    type: 'boolean',
    default: false,
  },
  layout: {
    default: {
      explorers: {
        hidden: false,
        panels: [
          {
            directory: process.cwd(),
          },
        ],
      },
      preview: {
        hidden: false,
      },
      terminals: {
        hidden: false,
        panels: [
          {
            directory: process.cwd(),
          },
        ],
      },
    },
    properties: {
      explorers: {
        properties: {
          hidden: {
            type: 'boolean',
            default: false,
          },
          panels: {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: {
              properties: {
                directory: {
                  type: 'string',
                  default: process.cwd(),
                },
                size: {
                  type: 'number',
                },
              },
            },
          },
          size: {
            type: 'number',
          },
        },
      },
      preview: {
        properties: {
          hidden: {
            type: 'boolean',
            default: false,
          },
          size: {
            type: 'number',
          },
        },
      },
      terminals: {
        properties: {
          hidden: {
            type: 'boolean',
            default: false,
          },
          panels: {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: {
              properties: {
                directory: {
                  type: 'string',
                  default: process.cwd(),
                },
                size: {
                  type: 'number',
                },
              },
            },
          },
          size: {
            type: 'number',
          },
        },
      },
    },
  },
};

class ThemesManager implements ISettingsStore {
  store: Store<Settings>;

  constructor() {
    this.store = new Store<Settings>({
      name: 'settings',
      schema: settingsSchema,
    });
  }

  openInEditor(): void {
    this.store.openInEditor();
  }

  getAll(): Settings {
    return this.store.store;
  }

  getValue(key: string): unknown {
    return this.store.get(key);
  }

  setValue(key: string, value: unknown): void {
    this.store.set(key, value);
  }

  resetSettings(): void {
    this.store.reset();
  }
}

export { ThemesManager };
