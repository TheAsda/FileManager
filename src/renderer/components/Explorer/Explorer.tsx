import { FileInfo, IDirectoryManager, IExplorerManager } from '@fm/common';
import React, { Component } from 'react';
import { clamp, noop, merge } from 'lodash';
import { DetailView } from './DetailView';
import { StateLine } from './StateLine';
import autobind from 'autobind-decorator';
import './style.css';
import { PathWrapper } from '../PathWrapper';
import { Commands } from '../modals';
import { ExplorerCommands } from './explorerCommands';
import { normalizePath } from 'filemancore';
import { join } from 'path';
import { HOHandlers } from '../common/HOHandlers';

interface ExplorerState {
  selectedIndex: number;
  viewType: 'detail' | 'folder';
  directoryState: FileInfo[];
  editableIndex?: number;
  editType?: 'create' | 'rename';
}

interface ExplorerProps extends HOHandlers {
  directoryManager: IDirectoryManager;
  explorerManager: IExplorerManager;
  onPreview?: (path: string) => void;
  onClose?: () => void;
  closable: boolean;
  onFocus?: () => void;
  onBlur?: (options: Commands) => void;
  onMove?: (files: FileInfo[]) => void;
  onCopy?: (files: FileInfo[]) => void;
  focused?: boolean;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  private options: ExplorerCommands;
  private handlers: Commands;

  constructor(props: ExplorerProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
      viewType: 'detail',
      directoryState: [],
    };

    this.handlers = {
      moveDown: this.selectNextItem,
      moveUp: this.selectPreviousItem,
      moveBack: this.exitDirectory,
      openDirectory: this.activateItem,
      newFile: this.createFile,
      newFolder: this.createFolder,
      rename: this.rename,
      delete: this.del,
      sendToTrash: this.sendToTrash,
      copy: this.copy,
      move: this.move,
    };

    this.options = {
      'Close panel': this.onClose,
      'Delete item': this.del,
      'New file': this.createFile,
      'New folder': this.createFolder,
      'Reload directory': this.updateDirectoryState,
      'Rename item': this.rename,
      'Send item to trash': this.sendToTrash,
      'Open in terminal': noop,
      'Copy item': this.copy,
      'Move item': this.move,
    };

    this.props.explorerManager.setCommands(merge(this.options, props.commands));
    this.props.explorerManager.setHotkeys(merge(this.handlers, props.hotkeys));
  }

  componentDidMount() {
    this.onDirectoryChange();

    if (this.props.focused) {
      this.onFocus();
    }
  }

  componentDidUpdate() {
    if (this.props.focused) {
      this.onFocus();
    }

    if (!this.props.closable) {
      delete this.options['Close panel'];
    } else {
      this.options['Close panel'] = this.onClose;
    }
  }

  private get selectedItem(): FileInfo {
    return this.state.directoryState[this.state.selectedIndex];
  }

  @autobind
  copy() {
    this.props.onCopy && this.props.onCopy([this.selectedItem]);
  }

  @autobind
  move() {
    this.props.onMove && this.props.onMove([this.selectedItem]);
  }

  @autobind
  onDirectoryChange() {
    this.props.directoryManager.listDirectory(this.props.explorerManager.getPath()).then((data) => {
      this.setState((state) => ({
        ...state,
        selectedIndex: 0,
        directoryState: data,
      }));
    });
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
      selectedIndex: clamp(index, 0, state.directoryState.length - 1),
    }));
  }

  @autobind
  activateItem() {
    if (this.selectedItem.attributes.directory) {
      this.activateDirectory();
    } else {
      // TODO: open file
    }
  }

  @autobind
  activateDirectory() {
    this.props.explorerManager.setPath(
      normalizePath(join(this.selectedItem.path, this.selectedItem.name))
    );
    this.onDirectoryChange();
  }

  @autobind
  exitDirectory() {
    this.props.explorerManager.setPath(normalizePath(join(this.selectedItem.path, '..')));
    this.onDirectoryChange();
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
        await this.props.directoryManager.createItem(
          name,
          this.props.explorerManager.getPath(),
          'folder'
        );
      } else {
        await this.props.directoryManager.createItem(
          name,
          this.props.explorerManager.getPath(),
          'file'
        );
      }

      this.updateDirectoryState();
    }

    if (this.state.editType === 'rename') {
      await this.props.directoryManager.renameItem(
        this.state.directoryState[this.state.editableIndex].name,
        name,
        this.props.explorerManager.getPath()
      );

      this.updateDirectoryState();
    }
  }

  @autobind
  private async updateDirectoryState() {
    const newDirectoryState = await this.props.directoryManager.listDirectory(
      this.props.explorerManager.getPath()
    );

    this.setState((state) => ({
      ...state,
      editableIndex: undefined,
      editType: undefined,
      directoryState: newDirectoryState,
      selectedIndex: 0,
    }));
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
          path: this.props.explorerManager.getPath(),
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
          path: this.props.explorerManager.getPath(),
          attributes: { directory: true, hidden: false, readonly: false, system: false },
        },
      ],
    }));
  }

  @autobind
  rename() {
    this.setState((state) => {
      return {
        ...state,
        editableIndex: state.selectedIndex,
        editType: 'rename',
      };
    });
  }

  @autobind
  async del() {
    await this.props.directoryManager.deleteItems([
      this.state.directoryState[this.state.selectedIndex],
    ]);

    this.updateDirectoryState();
  }

  @autobind
  async sendToTrash() {
    await this.props.directoryManager.sendItemsToTrash([
      this.state.directoryState[this.state.selectedIndex],
    ]);

    this.updateDirectoryState();
  }

  @autobind
  onBlur() {
    this.props.onBlur && this.props.onBlur(this.options);
  }

  @autobind
  onFocus() {
    console.log('focus');
    this.props.onFocus && this.props.onFocus();
  }

  render() {
    return (
      <PathWrapper
        closable={this.props.closable}
        onClose={this.onClose}
        path={this.props.explorerManager.getPath()}
      >
        <div className="explorer" onClick={this.onFocus}>
          {this.state.viewType === 'detail' ? (
            <DetailView
              data={this.state.directoryState}
              editableIndex={this.state.editableIndex}
              onEditEnd={this.onEditEnd}
              onExit={this.exitDirectory}
              onItemClick={(i) => this.selectItem(i)}
              onItemDoubleClick={(i) => {
                this.selectItem(i);
                this.activateItem();
              }}
              selectedIndex={this.state.selectedIndex}
            />
          ) : null}
          <StateLine count={this.state.directoryState.length} />
        </div>
      </PathWrapper>
    );
  }
}

export { Explorer };
