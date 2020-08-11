import React, { Component, RefObject, createRef } from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { ITerminalManager, Commands, Theme } from '@fm/common';
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
  theme: Theme;
}

class Terminal extends Component<TerminalProps> {
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      fontFamily: `${props.theme['terminal-font-family']}, 'Consolas'`,
      fontSize: props.theme['terminal-font-size'],
      rendererType: 'dom', // default is canvas
      theme: this.mapTheme(props.theme),
    });
    this.fitAddon = new FitAddon();

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

  componentDidUpdate(prevProps: TerminalProps) {
    if (!prevProps.focused && this.props.focused) {
      this.onFocus();
      this.containerRef.current?.focus();
      this.terminal.focus();
    } else if (prevProps.focused && !this.props.focused) {
      this.onBlur();
    }

    if (prevProps.theme !== this.props.theme) {
      this.terminal.setOption('theme', this.mapTheme(this.props.theme));
      this.terminal.setOption('fontFamily', this.props.theme['terminal-font-family']);
      this.terminal.setOption('fontSize', this.props.theme['terminal-font-size']);
    }
  }

  private mapTheme(theme: Theme) {
    return {
      background: theme['terminal-background-color'],
      black: theme['terminal-black-color'],
      blue: theme['terminal-blue-color'],
      brightBlack: theme['terminal-brightBlack-color'],
      brightBlue: theme['terminal-brightBlue-color'],
      brightCyan: theme['terminal-brightCyan-color'],
      brightGreen: theme['terminal-brightGreen-color'],
      brightMagenta: theme['terminal-brightMagenta-color'],
      brightRed: theme['terminal-brightRed-color'],
      brightWhite: theme['terminal-brightWhite-color'],
      brightYellow: theme['terminal-brightYellow-color'],
      cursor: theme['terminal-cursor-color'],
      cursorAccent: theme['terminal-cursorAccent-color'],
      cyan: theme['terminal-cyan-color'],
      foreground: theme['terminal-foreground-color'],
      green: theme['terminal-green-color'],
      magenta: theme['terminal-magenta-color'],
      red: theme['terminal-red-color'],
      selection: theme['terminal-selection-color'],
      white: theme['terminal-white-color'],
      yellow: theme['terminal-yellow-color'],
    };
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
      <PathWrapper
        closable={this.props.closable}
        onClose={this.props.onClose}
        path={this.props.terminalManager.getDirectory()}
      >
        <ResizeObserver onResize={this.resize}>
          <div className="terminal" ref={this.containerRef} />
        </ResizeObserver>
      </PathWrapper>
    );
  }
}

export { Terminal };
