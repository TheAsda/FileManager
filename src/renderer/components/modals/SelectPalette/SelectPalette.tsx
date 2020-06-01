import React, {
  useState,
  KeyboardEvent,
  useRef,
  Component,
  ChangeEvent,
} from 'react';
import autobind from 'autobind-decorator';
import { clamp, map, findIndex } from 'lodash';
import { HotKeys, KeyMap } from 'react-hotkeys';
import './style.css';
import { SelectPaletteItem } from './SelectPaletteItem';
import Modal from 'react-modal';

interface SelectPaletteProps {
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
    nextItem: this.selectNextItem,
    previousItem: this.selectPreviousItem,
    selectItem: this.selectItem,
    complete: this.complete,
  };

  private inputRef: HTMLInputElement | null;

  constructor(props: SelectPaletteProps) {
    super(props);

    this.state = { selectedIndex: 0 };
    this.inputRef = null;
  }

  @autobind
  selectNextItem() {
    this.setState({
      selectedIndex: clamp(
        this.state.selectedIndex + 1,
        0,
        this.props.options.length - 1
      ),
    });
  }

  @autobind
  selectPreviousItem() {
    this.setState({
      selectedIndex: clamp(
        this.state.selectedIndex - 1,
        0,
        this.props.options.length - 1
      ),
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
        isOpen={this.props.isOpened}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        onRequestClose={this.props.onClose}
      >
        <HotKeys
          keyMap={this.keyMap}
          handlers={this.handlers}
          className="select-palette"
        >
          <input
            className="select-palette__search"
            type="text"
            ref={(ref) => {
              this.inputRef = ref;
              ref && ref.focus();
            }}
            onChange={this.handleInput}
          />
          {map(this.props.options, (option, i) => (
            <SelectPaletteItem
              command={option}
              selected={i === this.state.selectedIndex}
              key={option}
            />
          ))}
        </HotKeys>
      </Modal>
    );
  }
}

export { SelectPalette };
