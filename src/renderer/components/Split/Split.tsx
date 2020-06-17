import React, { PropsWithChildren, ReactNode, useState, useEffect, Component } from 'react';
import { reduce, times, constant, clone, clamp, isArray, fill } from 'lodash';
import { Resizer } from './Resizer';
import { SplitPanel } from './SplitPanel';
import { SplitType } from './splitType';
import './style.css';
import autobind from 'autobind-decorator';

interface SplitProps {
  minSize?: number | number[];
  maxSize?: number | number[];
  panels: ReactNode[];
  splitType: SplitType;
}

interface SplitState {
  sizes: number[];
  active: boolean;
  x: number;
  y: number;
  resizerIndex: number;
  minSize: number[];
  maxSize: number[];
}

const DEFAULT_MIN_SIZE = 100;
const DEFAULT_MAX_SIZE = 600;

class Split extends Component<SplitProps, SplitState> {
  private containerRef: null | HTMLDivElement;

  constructor(props: SplitProps) {
    super(props);
    let totalLength;
    if (this.props.splitType === 'vertical') {
      totalLength = window.innerWidth;
    } else {
      totalLength = window.innerHeight;
    }

    this.state = {
      sizes: times(props.panels.length, constant(totalLength / props.panels.length)),
      active: false,
      x: 0,
      y: 0,
      resizerIndex: -1,
      minSize: isArray(props.minSize)
        ? props.minSize.length < props.panels.length
          ? fill(props.minSize, DEFAULT_MIN_SIZE, props.minSize.length - 1, props.panels.length)
          : props.minSize
        : fill(Array(props.panels.length), props.minSize ?? DEFAULT_MIN_SIZE),
      maxSize: isArray(props.maxSize)
        ? props.maxSize.length < props.panels.length
          ? fill(props.maxSize, DEFAULT_MAX_SIZE, props.maxSize.length - 1, props.panels.length)
          : props.maxSize
        : fill(Array(props.panels.length), props.maxSize ?? DEFAULT_MAX_SIZE),
    };

    this.containerRef = null;
  }

  @autobind
  onMouseMove(event: MouseEvent) {
    if (this.state.active && this.state.resizerIndex !== -1 && this.containerRef !== null) {
      event.preventDefault();

      const newSizes = clone(this.state.sizes);

      let mouseState: number;
      let newMouseState: number;

      if (this.props.splitType === 'vertical') {
        mouseState = this.state.x;
        newMouseState = event.clientX;
      } else {
        mouseState = this.state.y;
        newMouseState = event.clientY;
      }

      const delta = newMouseState - mouseState;

      const leftPanelIndex = this.state.resizerIndex;
      const rightPanelIndex = this.state.resizerIndex + 1;

      const newLeftPanelSize = newSizes[leftPanelIndex] + delta;
      const newRightPanelSize = newSizes[rightPanelIndex] - delta;

      if (
        newLeftPanelSize < this.state.minSize[leftPanelIndex] ||
        newLeftPanelSize > this.state.maxSize[leftPanelIndex] ||
        newRightPanelSize < this.state.minSize[rightPanelIndex] ||
        newRightPanelSize > this.state.maxSize[rightPanelIndex]
      ) {
        return;
      }

      console.log(newLeftPanelSize, newRightPanelSize);

      newSizes[leftPanelIndex] = newLeftPanelSize;
      newSizes[rightPanelIndex] = newRightPanelSize;

      this.setState((state) => ({
        ...state,
        x: newMouseState,
        sizes: newSizes,
      }));
    }
  }

  @autobind
  onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) {
    console.log('mousedown');
    const { clientX, clientY } = event;

    document.addEventListener('mouseup', this.onMouseUp);

    console.log(this.state.minSize);

    this.setState((state) => ({
      ...state,
      active: true,
      x: clientX,
      y: clientY,
      resizerIndex: index,
    }));
  }

  @autobind
  onMouseUp(event: MouseEvent) {
    console.log('mouseup');
    document.removeEventListener('mouseup', this.onMouseUp);
    this.setState((state) => ({
      ...state,
      active: false,
      resizerIndex: -1,
    }));
  }

  @autobind
  escHandler(event: KeyboardEvent) {
    if (event.key == 'Escape' || event.key == 'Esc' || event.keyCode == 27) {
      this.setState((state) => ({
        ...state,
        active: false,
      }));
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('keydown', this.escHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('keydown', this.escHandler);
  }

  render() {
    return (
      <div className="split-panels" ref={(ref) => (this.containerRef = ref)}>
        {reduce<ReactNode, ReactNode[]>(
          this.props.panels,
          (acc, cur, i) => {
            acc.push(
              <SplitPanel type={this.props.splitType} size={this.state.sizes[i]} key={i}>
                {cur}
              </SplitPanel>
            );

            if (i !== this.props.panels.length - 1) {
              acc.push(
                <Resizer
                  index={i}
                  onMouseDown={this.onMouseDown}
                  // onMouseUp={this.onMouseUp}
                  key={(i + 1) * 10}
                />
              );
            }

            return acc;
          },
          []
        )}
      </div>
    );
  }
}

export { Split, SplitProps };
