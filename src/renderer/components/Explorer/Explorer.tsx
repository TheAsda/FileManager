import { FileInfo, IDirectoryManager, Theme } from '@fm/common';
import React, { Component } from 'react';
import { clamp, filter, concat, sortBy } from 'lodash';
import { DetailView } from './DetailView';
import { StateLine } from './StateLine';
import autobind from 'autobind-decorator';
import { PathWrapper } from '../PathWrapper';
import { Commands } from '../modals';
import { ExplorerCommands } from './explorerCommands';
import { normalizePath, openWithDefaultApp } from 'filemancore';
import { join } from 'path';
import styled from 'styled-components';
import { CommandsWrapper, ExplorerStore, KeymapWrapper } from '@fm/store';

const Container = styled.div<Theme>`
  height: 100%;
  width: 100%;
  background-color: ${(props) => props['explorer.backgroundColor']};
  color: ${(props) => props['explorer.textColor']};
  display: grid;
  grid-template-rows: calc(100% - 20px) 20px;
  font-size: ${(props) => props['explorer.fontSize']};
  font-family: ${(props) => props['explorer.fontFamily']};
`;

interface ExplorerState {
  currentPath: string;
  selectedIndex: number;
  viewType: 'detail' | 'folder';
  directoryState: FileInfo[];
  editableIndex?: number;
  editType?: 'create' | 'rename';
}

interface ExplorerProps {
  directoryManager: IDirectoryManager;
  explorerState: ExplorerStore;
  onPreview?: (item: FileInfo) => void;
  onClose?: () => void;
  closable: boolean;
  onMove?: (files: FileInfo[]) => void;
  onCopy?: (files: FileInfo[]) => void;
  openInTerminal?: (path: string) => void;
  onDirectoryChange?: (path: string) => void;
  autoPreview: boolean;
  showHidden: boolean;
  index: number;
  theme: Theme;
  onMount: (ref: HTMLElement) => void;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  private options: ExplorerCommands;
  private handlers: Commands;
  private containerRef: HTMLElement | null;

  constructor(props: ExplorerProps) {
    super(props);

    this.containerRef = null;
    this.state = {
      selectedIndex: 0,
      viewType: 'detail',
      directoryState: [],
      currentPath: props.explorerState.path,
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
      refresh: this.refresh,
    };

    this.options = {
      'Close panel': this.onClose,
      'Delete item': this.del,
      'New file': this.createFile,
      'New folder': this.createFolder,
      'Reload directory': this.updateDirectoryState,
      'Rename item': this.rename,
      'Send item to trash': this.sendToTrash,
      'Open in terminal': this.openInTerminal,
      'Copy item': this.copy,
      'Move item': this.move,
      'Open item': this.openItem,
    };
  }

  componentDidMount() {
    this.onDirectoryChange();

    if (this.containerRef) {
      this.props.onMount(this.containerRef);
    }
  }

  componentDidUpdate() {
    if (this.props.explorerState.path !== this.state.currentPath) {
      this.onDirectoryChange();
    }

    if (!this.props.closable) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete this.options['Close panel'];
    } else {
      this.options['Close panel'] = this.onClose;
    }
  }

  private get selectedItem(): FileInfo {
    return this.state.directoryState[this.state.selectedIndex];
  }

  @autobind
  openItem() {
    if (this.selectedItem.attributes.directory) {
      this.activateDirectory();
    } else {
      openWithDefaultApp(this.selectedItem.path + this.selectedItem.name);
    }
  }

  @autobind
  openInTerminal() {
    this.props.openInTerminal && this.props.openInTerminal(this.selectedItem.path);
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
    this.props.directoryManager.listDirectory(this.props.explorerState.path).then((data) => {
      this.setState((state) => ({
        ...state,
        selectedIndex: 0,
        directoryState: this.sortFilterItems(data),
        currentPath: this.props.explorerState.path,
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
    const newIndex = clamp(index, 0, this.state.directoryState.length - 1);
    const newSelectedItem = this.state.directoryState[newIndex];

    if (this.props.autoPreview && newSelectedItem.attributes.directory === false) {
      this.props.onPreview && this.props.onPreview(newSelectedItem);
    }

    this.setState((state) => ({
      ...state,
      selectedIndex: newIndex,
    }));
  }

  @autobind
  activateItem() {
    if (this.selectedItem.attributes.directory) {
      this.activateDirectory();
    } else {
      this.props.onPreview && this.props.onPreview(this.selectedItem);
    }
  }

  @autobind
  activateDirectory() {
    // this.props.explorerManager.setPath(
    //   normalizePath(join(this.selectedItem.path, this.selectedItem.name))
    // );

    this.props.onDirectoryChange &&
      this.props.onDirectoryChange(
        normalizePath(join(this.selectedItem.path, this.selectedItem.name))
      );
    this.onDirectoryChange();
  }

  @autobind
  exitDirectory() {
    // this.props.explorerManager.setPath(normalizePath(join(this.selectedItem.path, '..')));
    this.props.onDirectoryChange &&
      this.props.onDirectoryChange(normalizePath(join(this.selectedItem.path, '..')));
    this.onDirectoryChange();
  }

  @autobind
  async onEditEnd(name: string | null) {
    if (!this.state.editableIndex) {
      return;
    }

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
        await this.props.directoryManager.createItem(name, this.props.explorerState.path, 'folder');
      } else {
        await this.props.directoryManager.createItem(name, this.props.explorerState.path, 'file');
      }

      this.updateDirectoryState();
    }

    if (this.state.editType === 'rename') {
      await this.props.directoryManager.renameItem(
        this.state.directoryState[this.state.editableIndex].name,
        name,
        this.props.explorerState.path
      );

      this.updateDirectoryState();
    }
  }

  @autobind
  refresh() {
    this.updateDirectoryState();
  }

  sortFilterItems(items: FileInfo[]): FileInfo[] {
    const folders = filter(items, ['attributes.directory', true]);
    const files = filter(items, ['attributes.directory', false]);
    return concat(sortBy(folders, 'name'), sortBy(files, 'name'));
  }

  @autobind
  private async updateDirectoryState() {
    const newDirectoryState = await this.props.directoryManager.listDirectory(
      this.props.explorerState.path
    );

    this.setState((state) => ({
      ...state,
      editableIndex: undefined,
      editType: undefined,
      directoryState: this.sortFilterItems(newDirectoryState),
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
          path: this.props.explorerState.path,
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
          path: this.props.explorerState.path,
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
  onClick(index: number) {
    if (this.state.selectedIndex === index) {
      this.activateItem();
    } else {
      this.selectItem(index);
    }
  }

  render() {
    return (
      <CommandsWrapper commands={this.options} scope={`explorer ${this.props.index}`}>
        <PathWrapper
          closable={this.props.closable}
          onClose={this.onClose}
          onRefresh={this.refresh}
          path={this.props.explorerState.path}
          refreshable
        >
          <KeymapWrapper handlers={this.handlers} scope={`explorer.${this.props.index}`}>
            <Container {...this.props.theme}>
              {this.state.viewType === 'detail' ? (
                <DetailView
                  data={this.state.directoryState}
                  editableIndex={this.state.editableIndex}
                  onEditEnd={this.onEditEnd}
                  onExit={this.exitDirectory}
                  onItemClick={this.onClick}
                  ref={(ref) => (this.containerRef = ref)}
                  selectedIndex={this.state.selectedIndex}
                />
              ) : null}
              <StateLine count={this.state.directoryState.length} />
            </Container>
          </KeymapWrapper>
        </PathWrapper>
      </CommandsWrapper>
    );
  }
}

export { Explorer };
