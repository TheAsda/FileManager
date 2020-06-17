import React, { Component, RefObject, createRef, useRef, MutableRefObject } from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { ITerminalManager } from '@fm/common';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import './style.css';
import autobind from 'autobind-decorator';
import { debounce } from 'lodash';

interface TerminalProps {
  terminalManager: ITerminalManager;
  initialDirectory?: string;
  onExit?: (exitCode: number) => void;
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
      fontFamily: `'Cascadia Code', 'Consolas'`,
      fontSize: 15,
      rendererType: 'dom', // default is canvas
    });
    this.fitAddon = new FitAddon();
  }

  componentDidMount() {
    if (this.containerRef.current) {
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(this.containerRef.current);
      this.TerminalManager.attach(this.terminal, this.props.onExit);
      this.props.initialDirectory &&
        this.TerminalManager.changeDirectory(this.props.initialDirectory);
      this.resize();
      this.terminal.onResize((size) => {
        this.TerminalManager.resize(size, this.terminal);
      });

      window.addEventListener('resize', this.debouncedFit);
      this.debouncedFit();
    }
  }

  debouncedFit = debounce(() => this.resize(), 17);

  @autobind
  resize() {
    this.fitAddon.fit();
  }

  componentWillUnmount() {
    this.terminal.dispose();
    this.TerminalManager.destroy();
  }

  render() {
    return <div className="terminal" ref={this.containerRef} />;
  }
}

export { Terminal };
