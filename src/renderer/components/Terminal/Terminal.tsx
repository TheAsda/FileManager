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
}

class Terminal extends Component<TerminalProps> {
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

  @autobind
  resize() {
    this.fitAddon.fit();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
    return (
      <PathWrapper closable={this.props.closable} onClose={this.props.onClose} path={''}>
        <div className="terminal" onFocus={this.props.onFocus} ref={this.containerRef} />
      </PathWrapper>
    );
  }
}

export { Terminal };
