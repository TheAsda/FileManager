import { FileInfo, IDirectoryManager, IKeysManager } from '@fm/common';
import React, { Component } from 'react';
import { DetailView } from './DetailView';
import { PathLine } from './PathLine';
import { StateLine } from './StateLine';
import { reduce, clamp, noop } from 'lodash';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import autobind from 'autobind-decorator';

interface ExplorerState {
  selectedIndex: number;
  directoryArray: string[];
  viewType: 'detail' | 'folder';
  directoryState: FileInfo[];
}

interface ExplorerProps {
  initialDirectoryArray?: string[];
  directoryManager: IDirectoryManager;
  keysManager: IKeysManager;
  getCachedDirectory: (path: string) => FileInfo[] | null;
  addToCache: (path: string, data: FileInfo[]) => void;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  constructor(props: ExplorerProps) {
    super(props);

    this.state = {
      directoryArray: props.initialDirectoryArray ?? ['C:'],
      selectedIndex: 0,
      viewType: 'detail',
      directoryState: [],
    };

    this.onDirectoryChange();
  }

  private get directoryString(): string {
    return reduce(this.state.directoryArray, (acc, cur) => acc + cur + '/', '');
  }

  @autobind
  onDirectoryChange() {
    const cachedDirectoryState = this.props.getCachedDirectory(
      this.directoryString
    );
    if (cachedDirectoryState === null) {
      this.props.directoryManager
        .listDirectory(this.directoryString)
        .then((data) => {
          this.props.addToCache(this.directoryString, data);
          this.setState((state) => ({
            ...state,
            selectedIndex: 0,
            directoryState: data,
          }));
        });
    } else {
      this.setState((state) => ({
        ...state,
        directoryState: cachedDirectoryState,
        selectedIndex: 0,
      }));
    }
  }

  @autobind
  selectNextItem() {
    this.setState((state) => ({
      ...state,
      selectedIndex: clamp(
        state.selectedIndex + 1,
        0,
        state.directoryState.length
      ),
    }));
  }

  @autobind
  selectPreviousItem() {
    this.setState((state) => ({
      ...state,
      selectedIndex: clamp(
        state.selectedIndex - 1,
        0,
        state.directoryState.length
      ),
    }));
  }

  @autobind
  exitDirectory() {
    this.setState(
      (state) => ({
        ...state,
        directoryArray: state.directoryArray.slice(
          0,
          state.directoryArray.length - 1
        ),
      }),
      () => this.onDirectoryChange()
    );
  }

  @autobind
  enterDirectory() {
    this.setState(
      (state) => ({
        ...state,
        directoryArray: [
          ...state.directoryArray,
          state.directoryState[state.selectedIndex].name,
        ],
      }),
      () => this.onDirectoryChange()
    );
  }

  createFile = noop;

  createFolder = noop;

  rename = noop;

  del = noop;

  sendToTrash = noop;

  handlers = {
    moveDown: this.selectNextItem,
    moveUp: this.selectPreviousItem,
    moveBack: this.exitDirectory,
    openDirectory: this.enterDirectory,
    newFile: this.createFile,
    newFolder: this.createFolder,
    rename: this.rename,
    delete: this.del,
    sendToTrash: this.sendToTrash,
  };

  render() {
    return (
      <HotKeys
        keyMap={this.props.keysManager.getKeyMap()}
        handlers={this.handlers}
        className="hot-keys explorer"
      >
        <PathLine path={this.directoryString} />
        {this.state.viewType === 'detail' ? (
          <DetailView
            data={this.state.directoryState}
            selectedIndex={this.state.selectedIndex}
          />
        ) : null}
        <StateLine count={this.state.directoryState.length} />
      </HotKeys>
    );
  }
}

export { Explorer };
