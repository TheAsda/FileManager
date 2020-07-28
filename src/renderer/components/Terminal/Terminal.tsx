import React, { Component, RefObject, createRef } from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { ITerminalManager, Commands } from '@fm/common';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import './style.css';
import autobind from 'autobind-decorator';
import { PathWrapper } from '../PathWrapper';
import { HOHandlers } from '../common/HOHandlers';
import { merge, noop } from 'lodash';
import { TerminalCommands } from './terminalCommands';
import ResizeObserver from 'rc-resize-observer';

interface TerminalProps extends HOHandlers {
  terminalManager: ITerminalManager;
  initialDirectory?: string;
  onExit?: (exitCode: number) => void;
  onClose?: () => void;
  closable: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  onReload?: () => void;
}

interface TerminalState {
  focused: boolean;
}

class Terminal extends Component<TerminalProps, TerminalState> {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: XTerm;
  private TerminalManager: ITerminalManager;
  private fitAddon: FitAddon;
  private options: TerminalCommands;
  private handlers: Commands;

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
        background: 'var(--terminal-background-color)',
        black: 'var(--terminal-black-color)',
        blue: 'var(--terminal-blue-color)',
        brightBlack: 'var(--terminal-brightBlack-color)',
        brightBlue: 'var(--terminal-brightBlue-color)',
        brightCyan: 'var(--terminal-brightCyan-color)',
        brightGreen: 'var(--terminal-brightGreen-color)',
        brightMagenta: 'var(--terminal-brightMagenta-color)',
        brightRed: 'var(--terminal-brightRed-color)',
        brightWhite: 'var(--terminal-brightWhite-color)',
        brightYellow: 'var(--terminal-brightYellow-color)',
        cursor: 'var(--terminal-cursor-color)',
        cursorAccent: 'var(--terminal-cursorAccent-color)',
        cyan: 'var(--terminal-cyan-color)',
        foreground: 'var(--terminal-foreground-color)',
        green: 'var(--terminal-green-color)',
        magenta: 'var(--terminal-magenta-color)',
        red: 'var(--terminal-red-color)',
        selection: 'var(--terminal-selection-color)',
        white: 'var(--terminal-white-color)',
        yellow: 'var(--terminal-yellow-color)',
      },
    });
    this.fitAddon = new FitAddon();
    this.state = {
      focused: false,
    };

    this.handlers = {};

    this.options = {
      'Close panel': this.props.onClose ?? noop,
      'Reload terminal': this.props.onReload ?? noop,
    };

    props.terminalManager.setCommands(merge(this.options, props.commands));
    props.terminalManager.setHotkeys(merge(this.handlers, props.hotkeys));
  }

  componentDidMount() {
    if (this.containerRef.current !== null) {
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(this.containerRef.current);
      this.terminal.attachCustomKeyEventHandler((event) => {
        if (event.ctrlKey && event.key === 'p') {
          return false;
        }
        return true;
      });
      this.TerminalManager.attach(this.terminal, this.props.onExit);
      this.props.initialDirectory &&
        this.TerminalManager.changeDirectory(this.props.initialDirectory);
      this.terminal.onResize((size) => {
        this.TerminalManager.resize(size, this.terminal);
      });
    }
  }

  componentDidUpdate() {
    if (!this.state.focused && this.props.focused) {
      this.onFocus();
      this.containerRef.current?.focus();
      this.terminal.focus();
    } else if (this.state.focused && !this.props.focused) {
      this.onBlur();
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
    this.terminal.blur();
    this.props.onBlur && this.props.onBlur();
    this.setState((state) => ({ ...state, focused: false }));
  }

  render() {
    return (
      <PathWrapper closable={this.props.closable} onClose={this.props.onClose} path={''}>
        <ResizeObserver onResize={this.resize}>
          <div className="terminal" ref={this.containerRef} />
        </ResizeObserver>
      </PathWrapper>
    );
  }
}

export { Terminal };
