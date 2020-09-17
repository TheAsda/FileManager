import 'xterm/css/xterm.css';

import { Commands } from '@fm/common/interfaces/Commands';
import { Theme } from '@fm/common/interfaces/Theme';
import { ITerminalManager } from '@fm/common/managers/TerminalManager';
import { styled } from '@fm/components/common/styled';
import { PathWrapper } from '@fm/components/PathWrapper';
import { CommandsWrapper } from '@fm/store/commandsStore';
import { KeymapWrapper } from '@fm/store/keymapStore';
import autobind from 'autobind-decorator';
import { noop } from 'lodash';
import ResizeObserver from 'rc-resize-observer';
import React, { Component, createRef, RefObject } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { TerminalCommands } from './terminalCommands';

const TerminalContainer = styled('div', {
  height: '100%',
  width: '100%',
  overflowX: 'hidden',
});

interface TerminalProps {
  terminalManager: ITerminalManager;
  initialDirectory?: string;
  onExit?: (exitCode: number) => void;
  onClose?: () => void;
  closable: boolean;
  onReload?: () => void;
  theme: Theme;
  index: number;
  onMount: (ref: HTMLElement) => void;
}

class Terminal extends Component<TerminalProps, { path: string }> {
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
      fontFamily: `${props.theme['terminal.fontFamily']}, 'Consolas'`,
      fontSize: props.theme['terminal.fontSize'],
      rendererType: 'dom', // default is canvas
      theme: this.mapTheme(props.theme),
    });

    this.fitAddon = new FitAddon();

    this.handlers = {};

    this.options = {
      'Close panel': this.props.onClose ?? noop,
      'Reload terminal': this.props.onReload ?? noop,
    };

    this.state = {
      path: this.props.terminalManager.getDirectory(),
    };
  }

  componentDidMount() {
    if (this.containerRef.current !== null) {
      this.props.onMount(this.containerRef.current);
      this.containerRef.current.addEventListener('focus', () => {
        console.log('terminal focus');
        this.terminal.focus();
      });
      this.containerRef.current.addEventListener('focusout', () => {
        this.terminal.blur();
      });
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(this.containerRef.current);
      this.terminal.attachCustomKeyEventHandler((event) => {
        if (event.ctrlKey && event.key === 'p') {
          return false;
        }
        return true;
      });
      this.TerminalManager.attach(this.terminal, this.props.onExit);
      this.terminal.onData((data) => {
        if (/[\r\n]/.test(data)) {
          this.setState({ path: this.props.terminalManager.getDirectory() });
        }
      });
      this.props.initialDirectory &&
        this.TerminalManager.changeDirectory(this.props.initialDirectory);
      this.terminal.onResize((size) => {
        this.TerminalManager.resize(size, this.terminal);
      });
    }
  }

  componentDidUpdate(prevProps: TerminalProps) {
    if (prevProps.theme !== this.props.theme) {
      this.terminal.setOption('theme', this.mapTheme(this.props.theme));
      this.terminal.setOption('fontFamily', this.props.theme['terminal.fontFamily']);
      this.terminal.setOption('fontSize', this.props.theme['terminal.fontSize']);
    }
  }

  private mapTheme(theme: Theme) {
    return {
      background: theme['terminal.backgroundColor'],
      black: theme['terminal.blackColor'],
      blue: theme['terminal.blueColor'],
      brightBlack: theme['terminal.brightBlackColor'],
      brightBlue: theme['terminal.brightBlueColor'],
      brightCyan: theme['terminal.brightCyanColor'],
      brightGreen: theme['terminal.brightGreenColor'],
      brightMagenta: theme['terminal.brightMagentaColor'],
      brightRed: theme['terminal.brightRedColor'],
      brightWhite: theme['terminal.brightWhiteColor'],
      brightYellow: theme['terminal.brightYellowColor'],
      cursor: theme['terminal.cursorColor'],
      cursorAccent: theme['terminal.cursorAccentColor'],
      cyan: theme['terminal.cyanColor'],
      foreground: theme['terminal.foregroundColor'],
      green: theme['terminal.greenColor'],
      magenta: theme['terminal.magentaColor'],
      red: theme['terminal.redColor'],
      selection: theme['terminal.selectionColor'],
      white: theme['terminal.whiteColor'],
      yellow: theme['terminal.yellowColor'],
    };
  }

  @autobind
  resize() {
    this.fitAddon.fit();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
    return (
      <CommandsWrapper commands={this.options} scope={`terminal.${this.props.index}`}>
        <KeymapWrapper handlers={this.handlers} scope={['terminal', this.props.index]}>
          <PathWrapper
            closable={this.props.closable}
            onClose={this.props.onClose}
            path={this.state.path}
          >
            <ResizeObserver onResize={this.resize}>
              <TerminalContainer ref={this.containerRef} />
            </ResizeObserver>
          </PathWrapper>
        </KeymapWrapper>
      </CommandsWrapper>
    );
  }
}

export { Terminal };
