import { KeyAction } from './interfaces';

class KeysHandler {
  private keymap: KeyAction[];

  constructor() {
    this.keymap = [];
    // document.onkeydown = (e) => {
    //   // e.preventDefault();
    //   console.log(e.key);
    //   switch (e.key) {
    //     case 'ArrowUp':
    //       if (selected > 0) {
    //         setSelected(selected - 1);
    //       }
    //       break;
    //     case 'ArrowDown':
    //       if (selected < dirState.length - 1) {
    //         setSelected(selected + 1);
    //       }
    //       break;
    //     case 'Enter':
    //       if (dirState[selected].type === 'folder') {
    //         setPath([...path, dirState[selected].name]);
    //         setSelected(0);
    //       } else {
    //         console.log(
    //           'document.onkeydown -> dirState[selected].fullPath',
    //           dirState[selected].fullPath
    //         );
    //         remote.shell.openExternal(dirState[selected].fullPath);
    //       }
    //       break;
    //     case 'Backspace':
    //       if (path.length > 1) {
    //         setPath(path.slice(0, path.length - 1));
    //         setSelected(0);
    //       }
    //       break;
    //   }
    // };
  }

  addHandler = (key: KeyAction) => {
    this.keymap.push(key);
  };
}
