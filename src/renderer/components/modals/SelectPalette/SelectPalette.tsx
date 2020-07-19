import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { clamp, findIndex, map, merge } from 'lodash';
import './style.css';
import { SelectPaletteItem } from './SelectPaletteItem';
import Modal from 'react-modal';
import { Commands, KeyMap } from '@fm/common';
import { HOHandlers } from 'renderer/components/common/HOHandlers';

interface SelectPaletteProps extends HOHandlers {
  options: string[];
  inputValue?: string;
  onSelect: (selectedItem: string) => void;
  onClose: () => void;
  isOpened: boolean;
}

interface SelectPaletteState {
  selectedIndex: number;
}

class SelectPalette extends Component<SelectPaletteProps, SelectPaletteState> {
  private keyMap: KeyMap = {
    close: ['esc'],
    nextItem: ['down'],
    previousItem: ['up'],
    selectItem: ['enter'],
    complete: ['ctrl+space'],
  };

  private handlers = {
    close: this.props.onClose,
    moveUp: this.selectNextItem,
    moveDown: this.selectPreviousItem,
    activate: this.selectItem,
    complete: this.complete,
  };

  private inputRef: HTMLInputElement | null;

  constructor(props: SelectPaletteProps) {
    super(props);

    this.state = { selectedIndex: 0 };
    this.inputRef = null;

    if (this.props.manager) {
      this.props.manager.setHotkeys(this.handlers);
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
    if (!this.inputRef || this.inputRef.value.length === 0) {
      return;
    }

    const regExp = new RegExp(this.inputRef.value, 'ig');
    const newIndex = findIndex(this.props.options, (item) => regExp.test(item));

    if (newIndex !== -1) {
      this.setState({ selectedIndex: newIndex });
    }
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
          }}
          type="text"
        />
        {map(this.props.options, (option, i) => (
          <SelectPaletteItem
            command={option}
            key={option}
            selected={i === this.state.selectedIndex}
          />
        ))}
      </Modal>
    );
  }
}

export { SelectPalette };
