import React, { Component, RefObject, createRef } from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { ITerminalManager } from '@fm/common';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import './style.css';
import autobind from 'autobind-decorator';
import { PathWrapper } from '../PathWrapper';

interface TerminalProps {
  terminalManager: ITerminalManager;
  initialDirectory?: string;
  onExit?: (exitCode: number) => void;
  onClose?: () => void;
  closable: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
}

interface TerminalState {
  focused: boolean;
}

class Terminal extends Component<TerminalProps, TerminalState> {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: XTerm;
  private TerminalManager: ITerminalManager;
  private fitAddon: FitAddon;

  constructor(props: TerminalProps) {
    super(props);

    this.TerminalManager = props.terminalManager;
    this.containerRef = createRef<HTMLDivElement>();
    this.terminal = new XTerm({
      convertEol: true,
      fontFamily: `'Cascadia Code PL', 'Consolas'`,
      fontSize: 15,
      rendererType: 'dom', // default is canvas
      theme: {
        background: '#212533',
      },
    });
    this.fitAddon = new FitAddon();
    this.state = {
      focused: false,
    };
  }

  componentDidMount() {
    if (this.containerRef.current !== null) {
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(this.containerRef.current);
      this.TerminalManager.attach(this.terminal, this.props.onExit);
      this.props.initialDirectory &&
        this.TerminalManager.changeDirectory(this.props.initialDirectory);
      this.terminal.onResize((size) => {
        this.TerminalManager.resize(size, this.terminal);
      });

      window.addEventListener('resize', this.resize);

      this.resize();
    }
  }

  componentDidUpdate() {
    if (!this.state.focused && this.props.focused) {
      this.onFocus();
    } else if (this.state.focused && !this.props.focused) {
      this.onBlur();
    }
    if (this.props.focused) {
      this.containerRef.current?.focus();
      this.terminal.focus();
    }
  }

  @autobind
  resize() {
    this.fitAddon.fit();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @autobind
  onFocus() {
    this.props.onFocus && this.props.onFocus();
    this.setState((state) => ({ ...state, focused: true }));
  }

  @autobind
  onBlur() {
    this.props.onBlur && this.props.onBlur();
    this.setState((state) => ({ ...state, focused: false }));
  }

  render() {
    return (
      <PathWrapper closable={this.props.closable} onClose={this.props.onClose} path={''}>
        <div className="terminal" ref={this.containerRef} />
      </PathWrapper>
    );
  }
}

export { Terminal };
