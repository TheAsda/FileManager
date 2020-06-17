import { FileInfo, IDirectoryManager } from '@fm/common';
import React, { Component } from 'react';
import { clamp, noop, reduce } from 'lodash';
import { DetailView } from './DetailView';
import { HotKeys } from 'react-hotkeys';
import { PathLine } from './PathLine';
import { StateLine } from './StateLine';
import autobind from 'autobind-decorator';
import './style.css';

interface ExplorerState {
  selectedIndex: number;
  initialDirectory: string;
  directoryArray: string[];
  viewType: 'detail' | 'folder';
  directoryState: FileInfo[];
}

interface ExplorerProps {
  initialDirectory?: string;
  directoryManager: IDirectoryManager;
  getCachedDirectory?: (path: string) => FileInfo[] | null;
  addToCache?: (path: string, data: FileInfo[]) => void;
  focus?: boolean;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  constructor(props: ExplorerProps) {
    super(props);

    this.state = {
      initialDirectory: props.initialDirectory ?? 'C:/',
      directoryArray: props.initialDirectory?.split(/[\\/]+/) ?? ['C:'],
      selectedIndex: 0,
      viewType: 'detail',
      directoryState: [],
    };
  }

  componentDidMount() {
    this.onDirectoryChange();
  }

  private get directoryString(): string {
    return reduce(this.state.directoryArray, (acc, cur) => acc + cur + '/', '');
  }

  @autobind
  onDirectoryChange() {
    const cachedDirectoryState =
      (this.props.getCachedDirectory && this.props.getCachedDirectory(this.directoryString)) ??
      null;
    if (cachedDirectoryState === null) {
      this.props.directoryManager.listDirectory(this.directoryString).then((data) => {
        this.props.addToCache && this.props.addToCache(this.directoryString, data);
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
      selectedIndex: clamp(state.selectedIndex + 1, 0, state.directoryState.length),
    }));
  }

  @autobind
  selectPreviousItem() {
    this.setState((state) => ({
      ...state,
      selectedIndex: clamp(state.selectedIndex - 1, 0, state.directoryState.length),
    }));
  }

  @autobind
  exitDirectory() {
    this.setState(
      (state) => ({
        ...state,
        directoryArray: state.directoryArray.slice(0, state.directoryArray.length - 1),
      }),
      () => this.onDirectoryChange()
    );
  }

  @autobind
  enterDirectory() {
    this.setState(
      (state) => ({
        ...state,
        directoryArray: [...state.directoryArray, state.directoryState[state.selectedIndex].name],
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
      <HotKeys className="hot-keys" handlers={this.handlers}>
        <div className="explorer">
          <PathLine path={this.directoryString} />
          {this.state.viewType === 'detail' ? (
            <DetailView data={this.state.directoryState} selectedIndex={this.state.selectedIndex} />
          ) : null}
          <StateLine count={this.state.directoryState.length} />
        </div>
      </HotKeys>
    );
  }
}

export { Explorer };
