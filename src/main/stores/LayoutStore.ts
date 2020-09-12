import { ILayoutStore } from '../interfaces/ILayoutStore';
import { Layout } from '../../common/interfaces';
import Store, { Schema } from 'electron-store';
import { isEmpty } from 'lodash';

const layoutSchema: Schema<Layout> = {
  window: {
    properties: {
      width: {
        type: 'number',
        default: 800,
      },
      height: {
        type: 'number',
        default: 600,
      },
    },
  },
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
};

class LayoutStore implements ILayoutStore {
  store: Store<Layout>;

  constructor() {
    this.store = new Store({
      name: 'layout',
      schema: layoutSchema,
    });
  }

  get(): Layout {
    if (isEmpty(this.store.store)) {
      const initialState: Layout = {
        window: {
          width: 800,
          height: 600,
        },
        explorers: {
          size: 400,
          hidden: false,
          panels: [
            {
              directory: process.cwd(),
              size: 600,
            },
          ],
        },
        preview: {
          hidden: true,
          size: 0,
        },
        terminals: {
          hidden: false,
          size: 400,
          panels: [
            {
              directory: process.cwd(),
              size: 600,
            },
          ],
        },
      };

      this.store.set(initialState);
    }

    return this.store.store;
  }

  save(layout: Layout): void {
    this.store.set(layout);
  }
}

export { LayoutStore };
