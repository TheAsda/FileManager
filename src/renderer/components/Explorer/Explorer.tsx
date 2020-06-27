import { FileInfo, IDirectoryManager, IExplorerManager } from '@fm/common';
import React, { Component } from 'react';
import { clamp, noop } from 'lodash';
import { DetailView } from './DetailView';
import { HotKeys } from 'react-hotkeys';
import { StateLine } from './StateLine';
import autobind from 'autobind-decorator';
import './style.css';
import { PathWrapper } from '../PathWrapper';

interface ExplorerState {
  selectedIndex: number;
  initialDirectory: string;
  viewType: 'detail' | 'folder';
  directoryState: FileInfo[];
  editableIndex?: number;
  editType?: 'create' | 'rename';
}

interface ExplorerProps {
  initialDirectory?: string;
  directoryManager: IDirectoryManager;
  explorerManager: IExplorerManager;
  getCachedDirectory?: (path: string) => FileInfo[] | null;
  addToCache?: (path: string, data: FileInfo[]) => void;
  focus?: boolean;
  onPreview?: (path: string) => void;
  onClose?: () => void;
  closable: boolean;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  constructor(props: ExplorerProps) {
    super(props);

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

  private get selectedItem(): FileInfo {
    return this.state.directoryState[this.state.selectedIndex];
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
    if (this.state.editType !== undefined && index !== this.state.editableIndex) {
      return;
    }
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
    if (this.selectedItem.attributes.directory) {
      this.props.explorerManager.enterDirectory(this.selectedItem.name);
      this.onDirectoryChange();
    } else {
      this.props.onPreview &&
        this.props.onPreview(this.props.explorerManager.getPathString() + this.selectedItem.name);
    }
  }

  @autobind
  async onEditEnd(name: string | null) {
    if (!this.state.editableIndex) {
      return;
    }

    // Forced edit end
    if (name === null) {
      this.setState((state) => ({
        ...state,
        editableIndex: undefined,
        editType: undefined,
        directoryState: state.directoryState.slice(0, state.directoryState.length - 1),
        selectedIndex: 0,
      }));
      return;
    }

    if (name.length === 0) {
      // TODO: show error about empty file

      return;
    }

    if (this.state.editType === 'create') {
      if (this.state.directoryState[this.state.editableIndex].attributes.directory) {
        this.props.directoryManager.createItem(
          name,
          this.props.explorerManager.getPathString(),
          'folder'
        );
      } else {
        this.props.directoryManager.createItem(
          name,
          this.props.explorerManager.getPathString(),
          'file'
        );
      }

      const newDirectoryState = await this.props.directoryManager.listDirectory(
        this.props.explorerManager.getPathString()
      );

      this.setState((state) => ({
        ...state,
        editableIndex: undefined,
        editType: undefined,
        directoryState: newDirectoryState,
        selectedIndex: 0,
      }));
    }
  }

  @autobind
  createFile() {
    this.setState((state) => ({
      ...state,
      selectedIndex: state.directoryState.length,
      editableIndex: state.directoryState.length,
      editType: 'create',
      directoryState: [
        ...state.directoryState,
        {
          name: '',
          accessible: true,
          path: this.props.explorerManager.getPathString(),
          attributes: { directory: false, hidden: false, readonly: false, system: false },
        },
      ],
    }));
  }

  @autobind
  onClose() {
    this.props.onClose && this.props.onClose();
  }

  @autobind
  createFolder() {
    this.setState((state) => ({
      ...state,
      selectedIndex: state.directoryState.length,
      editableIndex: state.directoryState.length,
      editType: 'create',
      directoryState: [
        ...state.directoryState,
        {
          name: '',
          accessible: true,
          path: this.props.explorerManager.getPathString(),
          attributes: { directory: true, hidden: false, readonly: false, system: false },
        },
      ],
    }));
  }

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
        <PathWrapper
          closable={this.props.closable}
          onClose={this.onClose}
          path={this.props.explorerManager.getPathString()}
        >
          <div className="explorer">
            {this.state.viewType === 'detail' ? (
              <DetailView
                canExit={this.props.explorerManager.getPathArray().length !== 1}
                data={this.state.directoryState}
                editableIndex={this.state.editableIndex}
                onEditEnd={this.onEditEnd}
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
        </PathWrapper>
      </HotKeys>
    );
  }
}

export { Explorer };
