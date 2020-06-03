import React, { Component, RefObject, createRef } from 'react';
import { remote } from 'electron';
import { IPty } from 'node-pty';
import { Terminal as Term } from 'xterm';
import { platform, homedir } from 'os';
import 'xterm/css/xterm.css';
import { ITerminalManager } from '@fm/common';

interface TerminalProps {
  terminalManager: ITerminalManager;
}

class Terminal extends Component<TerminalProps> {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: Term;
  private TerminalManager: ITerminalManager;

  constructor(props: TerminalProps) {
    super(props);

    this.TerminalManager = props.terminalManager;
    this.containerRef = createRef<HTMLDivElement>();
    this.terminal = new Term();
  }

  componentDidMount() {
    if (this.containerRef.current) {
      this.terminal.open(this.containerRef.current);
      this.TerminalManager.attach(this.terminal);
    }
  }

  componentWillUnmount() {
    this.terminal.dispose();
  }

  render() {
    return <div ref={this.containerRef} />;
  }
}

export { Terminal };
