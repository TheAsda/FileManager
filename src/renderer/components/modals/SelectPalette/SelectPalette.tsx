import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { clamp, map, includes, isEqual, indexOf } from 'lodash';
import { SelectPaletteItem } from './SelectPaletteItem';
import { Modal } from 'react-responsive-modal';
import { withTheme, ThemeProp } from '@fm/components/common';
import Fuse from 'fuse.js';
import styled from 'styled-components';
import { KeymapWrapper } from '@fm/store/keymapStore';

const Header = styled.div`
  border-bottom: 2px solid 5px;
  padding-bottom: 5px;
  margin-bottom: 5px;
`;

const Search = styled.input`
  width: 100%;
  outline: none;
`;

const ListBox = styled.ul`
  margin: 0;
  padding: 0;
`;

interface SelectPaletteProps extends ThemeProp {
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
  private fuse: Fuse<string>;

  constructor(props: SelectPaletteProps) {
    super(props);

    this.state = { selectedIndex: 0, options: props.options, allOptions: props.options };
    this.inputRef = null;
    this.fuse = new Fuse(props.options, {
      findAllMatches: true,
    });
  }

  componentDidUpdate() {
    if (!isEqual(this.props.options, this.state.allOptions)) {
      this.fuse.setCollection(this.props.options);
      this.setState((state) => ({
        ...state,
        allOptions: this.props.options,
        options: this.props.options,
      }));
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
    const selectedItem = this.state.options[this.state.selectedIndex];
    this.props.onSelect(selectedItem);
    if (this.inputRef) {
      this.inputRef.value = '';
    }
  }

  @autobind
  complete() {
    if (!this.inputRef) {
      return;
    }

    this.inputRef.value = this.state.options[this.state.selectedIndex];
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
        onClose={this.props.onClose}
        open={this.props.isOpened}
        showCloseIcon={false}
        styles={{
          modal: {
            padding: '10px',
            color: this.props.theme['palette.textColor'],
            backgroundColor: this.props.theme['palette.backgroundColor'],
            width: '80%',
          },
        }}
        closeOnOverlayClick
      >
        <KeymapWrapper handlers={this.handlers} scopePath="selectPalette">
          <Header>
            <Search
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
              role="search"
              type="text"
            />
          </Header>
          <ListBox role="listbox">
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
          </ListBox>
        </KeymapWrapper>
      </Modal>
    );
  }
}

const ThemedSelectPalette = withTheme(SelectPalette);

export { ThemedSelectPalette as SelectPalette, SelectPaletteProps };
