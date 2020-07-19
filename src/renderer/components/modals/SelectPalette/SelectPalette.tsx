import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { clamp, map, includes, isEqual, indexOf } from 'lodash';
import './style.css';
import { SelectPaletteItem } from './SelectPaletteItem';
import Modal from 'react-modal';
import { HOHandlers } from 'renderer/components/common/HOHandlers';
import Fuse from 'fuse.js';

interface SelectPaletteProps extends HOHandlers {
  options: string[];
  inputValue?: string;
  onSelect: (selectedItem: string) => void;
  onClose: () => void;
  isOpened: boolean;
}

interface SelectPaletteState {
  selectedIndex: number;
  options: string[];
  allOptions: string[];
}

class SelectPalette extends Component<SelectPaletteProps, SelectPaletteState> {
  private handlers = {
    close: this.props.onClose,
    moveDown: this.selectNextItem,
    moveUp: this.selectPreviousItem,
    activate: this.selectItem,
    complete: this.complete,
  };

  private inputRef: HTMLInputElement | null;
  private fuse: Fuse<string, Fuse.IFuseOptions<string>>;

  constructor(props: SelectPaletteProps) {
    super(props);

    this.state = { selectedIndex: 0, options: props.options, allOptions: props.options };
    this.inputRef = null;
    this.fuse = new Fuse(props.options, {
      findAllMatches: true,
    });

    if (this.props.manager) {
      this.props.manager.setHotkeys(this.handlers);
      console.log('SelectPalette -> constructor -> this.props.manager', this.props.manager);
    }
  }

  componentDidUpdate() {
    if (!isEqual(this.props.options, this.state.allOptions)) {
      this.setState((state) => ({
        ...state,
        allOptions: this.props.options,
        options: this.props.options,
      }));
      this.fuse = new Fuse(this.props.options, {
        findAllMatches: true,
      });
    }
  }

  @autobind
  selectNextItem() {
    this.setState({
      selectedIndex: clamp(this.state.selectedIndex + 1, 0, this.props.options.length - 1),
    });
  }

  @autobind
  selectPreviousItem() {
    this.setState({
      selectedIndex: clamp(this.state.selectedIndex - 1, 0, this.props.options.length - 1),
    });
  }

  @autobind
  selectItem() {
    const selectedItem = this.props.options[this.state.selectedIndex];
    this.props.onSelect(selectedItem);
  }

  @autobind
  complete() {
    if (!this.inputRef) {
      return;
    }

    this.inputRef.value = this.props.options[this.state.selectedIndex];
  }

  @autobind
  handleInput() {
    if (!this.inputRef) {
      return;
    }

    const oldOption = this.state.options[this.state.selectedIndex];
    const result = this.fuse.search(this.inputRef.value);
    let resultStrings = map(result, 'item');
    if (resultStrings.length === 0) {
      resultStrings = this.state.allOptions;
    }
    const newIndex = indexOf(resultStrings, oldOption);

    this.setState((state) => ({
      ...state,
      options: resultStrings,
      selectedIndex: newIndex === -1 ? 0 : newIndex,
    }));
  }

  render() {
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isOpened}
        onRequestClose={this.props.onClose}
        shouldCloseOnOverlayClick={true}
      >
        <input
          className="select-palette__search"
          onChange={this.handleInput}
          ref={(ref) => {
            this.inputRef = ref;
            ref?.focus();
            ref &&
              ref.addEventListener('keydown', (event) => {
                if (includes([38, 40], event.keyCode)) {
                  event.preventDefault();
                }
              });
          }}
          type="text"
        />
        {map(this.state.options, (option, i) => (
          <SelectPaletteItem
            command={option}
            key={option}
            onSelect={() => {
              this.setState(
                (state) => ({
                  ...state,
                  selectedIndex: i,
                }),
                this.selectItem
              );
            }}
            selected={i === this.state.selectedIndex}
          />
        ))}
      </Modal>
    );
  }
}

export { SelectPalette };
