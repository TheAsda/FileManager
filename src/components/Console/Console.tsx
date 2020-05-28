import React, {
  useState,
  useRef,
  useEffect,
  Component,
  RefObject,
  createRef,
} from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

class Console extends Component<{}, { curLine: string }> {
  private containerRef: RefObject<HTMLDivElement>;
  private terminal: Terminal;

  constructor(props: {}) {
    super(props);

    this.containerRef = createRef<HTMLDivElement>();
    this.terminal = new Terminal();
    this.terminal.onKey(this.onData);
    this.state = {
      curLine: '',
    };
  }

  componentDidMount() {
    if (this.containerRef.current) {
      this.terminal.open(this.containerRef.current);
      this.terminal.write(' $ ');
    }
  }

  componentWillUnmount() {
    this.terminal.dispose();
  }

  prompt = () => {
    this.setState({
      curLine: '',
    });
  };

  onData = (key: { key: string; domEvent: KeyboardEvent }) => {
    switch (key.domEvent.keyCode) {
      case 13:
        if (this.state) {
          this.terminal.write('\r\n $ ');
          this.prompt();
        }
        break;
      case 8:
        if (this.state) {
          this.setState((state) => ({
            curLine: state.curLine.slice(0, state.curLine.length),
          }));
          this.terminal.write('\b \b');
        }
        break;
      default:
        this.setState((state) => ({
          curLine: state.curLine + key.key,
        }));
        this.terminal.write(key.key);
        break;
    }
  };

  render() {
    return <div ref={this.containerRef} />;
  }
}

export { Console };
