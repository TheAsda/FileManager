import { FileInfo, IDirectoryManager, IExplorerManager } from '@fm/common';
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
  viewType: 'detail' | 'folder';
  directoryState: FileInfo[];
}

interface ExplorerProps {
  initialDirectory?: string;
  directoryManager: IDirectoryManager;
  explorerManager: IExplorerManager;
  getCachedDirectory?: (path: string) => FileInfo[] | null;
  addToCache?: (path: string, data: FileInfo[]) => void;
  focus?: boolean;
  onPreview?: (path: string) => void;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  constructor(props: ExplorerProps) {
    super(props);

    props.explorerManager.setPath(props.initialDirectory?.split(/[\\/]+/) ?? ['D:']);

    this.state = {
      initialDirectory: props.initialDirectory ?? 'D:/',
      selectedIndex: 0,
      viewType: 'detail',
      directoryState: [],
    };
  }

  componentDidMount() {
    this.onDirectoryChange();
  }

  @autobind
  onDirectoryChange() {
    const cachedDirectoryState =
      (this.props.getCachedDirectory &&
        this.props.getCachedDirectory(this.props.explorerManager.getPathString())) ??
      null;
    if (cachedDirectoryState === null) {
      this.props.directoryManager
        .listDirectory(this.props.explorerManager.getPathString())
        .then((data) => {
          this.props.addToCache &&
            this.props.addToCache(this.props.explorerManager.getPathString(), data);
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
  selectNextItem(keyEvent?: KeyboardEvent | undefined) {
    keyEvent?.preventDefault();
    this.selectItem(this.state.selectedIndex + 1);
  }

  @autobind
  selectPreviousItem(keyEvent?: KeyboardEvent | undefined) {
    keyEvent?.preventDefault();
    this.selectItem(this.state.selectedIndex - 1);
  }

  @autobind
  selectItem(index: number) {
    this.setState((state) => ({
      ...state,
      selectedIndex: clamp(index, -1, state.directoryState.length - 1),
    }));
  }

  @autobind
  exitDirectory() {
    this.props.explorerManager.exitDirectory();
    this.onDirectoryChange();
  }

  @autobind
  enterDirectory() {
    if (this.state.selectedIndex === -1) {
      return;
    }
    if (this.state.directoryState[this.state.selectedIndex].attributes.directory) {
      this.props.explorerManager.enterDirectory(
        this.state.directoryState[this.state.selectedIndex].name
      );
      this.onDirectoryChange();
    } else {
      this.props.onPreview &&
        this.props.onPreview(
          this.props.explorerManager.getPathString() +
            this.state.directoryState[this.state.selectedIndex].name
        );
    }
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
          <PathLine path={this.props.explorerManager.getPathString()} />
          {this.state.viewType === 'detail' ? (
            <DetailView
              canExit={this.props.explorerManager.getPathArray().length !== 1}
              data={this.state.directoryState}
              onExit={this.exitDirectory}
              onItemClick={(i) => this.selectItem(i)}
              onItemDoubleClick={(i) => {
                this.selectItem(i);
                this.enterDirectory();
              }}
              selectedIndex={this.state.selectedIndex}
            />
          ) : null}
          <StateLine count={this.state.directoryState.length} />
        </div>
      </HotKeys>
    );
  }
}

export { Explorer };
