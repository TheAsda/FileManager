import { IPathStore } from '../interfaces/IPathStore';
import { PathStore } from '../stores/PathStore';
import { registerIpc } from '../ipc';
import { Channels } from '../../common/Channels';

let pathStore: IPathStore;

const initPathIpc = () => {
  pathStore = new PathStore();

  registerIpc(Channels.GET_PATH, (event) => {
    event.returnValue = pathStore.getPaths();
  });

  registerIpc(Channels.ADD_PATH, (event, arg: string) => {
    pathStore.addToPath(arg);

    event.returnValue = pathStore.getPaths();
  });
};

export { initPathIpc };
