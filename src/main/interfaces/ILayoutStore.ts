import { Layout } from '../../common/interfaces';

interface ILayoutStore {
  get(): Layout;

  save(layout: Layout): void;
}

export { ILayoutStore };
