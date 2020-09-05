import React, { Component, ReactNode } from 'react';
import {
  clone,
  fill,
  isArray,
  reduce,
  times,
  map,
  compact,
  isEqual,
  isFunction,
  every,
} from 'lodash';
import { Resizer } from './Resizer';
import { SplitPanel } from './SplitPanel';
import { SplitType } from './splitType';
import autobind from 'autobind-decorator';
import styled from 'styled-components';

const Container = styled.div<{ type: SplitType }>`
  display: flex;
  flex-direction: ${(props) => (props.type === 'horizontal' ? 'column' : 'row')};
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
`;

interface SplitPanelsProps {
  minSize?: number | number[];
  maxSize?: number | number[];
  children: ((data: { width?: number }) => ReactNode) | ReactNode | ReactNode[];
  splitType: SplitType;
  className?: string;
  onResize?: (sizes: number[]) => void;
  initialSizes?: number[];
}

interface SplitPanelsState {
  sizes: number[];
  active: boolean;
  x: number;
  y: number;
  resizerIndex: number;
  minSize: number[];
  maxSize: number[];
  initialMinSize?: number | number[];
  initialMaxSize?: number | number[];
}

const DEFAULT_MIN_SIZE = 100;
const DEFAULT_MAX_SIZE = 2000;

class SplitPanels extends Component<SplitPanelsProps, SplitPanelsState> {
  private containerRef: null | HTMLDivElement;

  constructor(props: SplitPanelsProps) {
    super(props);

    const children = isArray(props.children) ? props.children : [props.children];

    const initialSizes =
      props.initialSizes && every(props.initialSizes, (size) => size !== 0)
        ? props.initialSizes
        : [];

    // TODO: check initialSizes
    this.state = {
      sizes: initialSizes,
      active: false,
      x: 0,
      y: 0,
      resizerIndex: -1,
      minSize: isArray(props.minSize)
        ? props.minSize.length < children.length
          ? fill(props.minSize, DEFAULT_MIN_SIZE, props.minSize.length - 1, children.length)
          : props.minSize
        : fill(Array(children.length), props.minSize ?? DEFAULT_MIN_SIZE),
      maxSize: isArray(props.maxSize)
        ? props.maxSize.length < children.length
          ? fill(props.maxSize, DEFAULT_MAX_SIZE, props.maxSize.length - 1, children.length)
          : props.maxSize
        : fill(Array(children.length), props.maxSize ?? DEFAULT_MAX_SIZE),
      initialMaxSize: props.maxSize,
      initialMinSize: props.minSize,
    };

    this.containerRef = null;
  }

  private get children() {
    return isArray(this.props.children) ? compact(this.props.children) : [this.props.children];
  }

  static getDerivedStateFromProps(
    props: SplitPanelsProps,
    state: SplitPanelsState
  ): SplitPanelsState {
    const children = isArray(props.children) ? props.children : [props.children];

    if (
      isEqual(props.maxSize, state.initialMaxSize) &&
      isEqual(props.minSize, state.initialMinSize) &&
      isEqual(children.length, state.sizes.length)
    ) {
      return state;
    }

    return {
      ...state,
      minSize: isArray(props.minSize)
        ? props.minSize.length < children.length
          ? fill(props.minSize, DEFAULT_MIN_SIZE, props.minSize.length - 1, children.length)
          : props.minSize
        : fill(Array(children.length), props.minSize ?? DEFAULT_MIN_SIZE),
      maxSize: isArray(props.maxSize)
        ? props.maxSize.length < children.length
          ? fill(props.maxSize, DEFAULT_MAX_SIZE, props.maxSize.length - 1, children.length)
          : props.maxSize
        : fill(Array(children.length), props.maxSize ?? DEFAULT_MAX_SIZE),
      initialMaxSize: props.maxSize,
      initialMinSize: props.minSize,
    };
  }

  componentDidUpdate() {
    if (this.children.length !== this.state.sizes.length) {
      if (this.containerRef !== null) {
        let totalLength: number;

        const containerInfo = this.containerRef.getBoundingClientRect();

        if (this.props.splitType === 'vertical') {
          totalLength = containerInfo.width;
        } else {
          totalLength = containerInfo.height;
        }

        totalLength -= (this.children.length - 1) * 4;

        const sizes = times(this.children.length, () => totalLength / this.children.length);

        this.setState((state) => ({ ...state, sizes }));
      }
    }
  }

  // TODO: add debounce
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

      newSizes[leftPanelIndex] = newLeftPanelSize;
      newSizes[rightPanelIndex] = newRightPanelSize;

      this.props.onResize && this.props.onResize(newSizes);

      if (this.props.splitType === 'vertical') {
        this.setState((state) => ({
          ...state,
          x: newMouseState,
          sizes: newSizes,
        }));
      } else {
        this.setState((state) => ({
          ...state,
          y: newMouseState,
          sizes: newSizes,
        }));
      }
    }
  }

  @autobind
  onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) {
    const { clientX, clientY } = event;

    document.addEventListener('mouseup', this.onMouseUp);

    this.setState((state) => ({
      ...state,
      active: true,
      x: clientX,
      y: clientY,
      resizerIndex: index,
    }));
  }

  @autobind
  onMouseUp() {
    document.removeEventListener('mouseup', this.onMouseUp);
    this.setState((state) => ({
      ...state,
      active: false,
      resizerIndex: -1,
    }));
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
  }

  @autobind
  onResize() {
    if (this.containerRef !== null && this.children.length !== 0) {
      let totalLength: number;

      const containerInfo = this.containerRef.getBoundingClientRect();

      if (this.props.splitType === 'vertical') {
        totalLength = containerInfo.width;
      } else {
        totalLength = containerInfo.height;
      }

      totalLength -= (this.children.length - 1) * 4;

      let sizes: number[];
      if (this.state.sizes.length !== 0) {
        const oldWindowSize = reduce(this.state.sizes, (acc, cur) => acc + cur, 0);

        const percents = map(this.state.sizes, (item) => item / oldWindowSize);

        // TODO: check minimal panel size
        sizes = map(percents, (item) => totalLength * item);
      } else {
        sizes = times(this.children.length, () => totalLength / this.children.length);
      }

      this.setState((state) => ({ ...state, sizes }));
    }
  }

  render() {
    return (
      <Container ref={(ref) => (this.containerRef = ref)} type={this.props.splitType}>
        {reduce<ReactNode, ReactNode[]>(
          this.children,
          (acc, cur, i) => {
            acc.push(
              <SplitPanel key={i} size={this.state.sizes[i]} type={this.props.splitType}>
                {isFunction(cur) ? cur({ width: this.state.sizes[i] }) : cur}
              </SplitPanel>
            );

            if (i !== this.children.length - 1) {
              acc.push(
                <Resizer
                  index={i}
                  key={(i + 1) * 10}
                  onMouseDown={this.onMouseDown}
                  type={this.props.splitType}
                />
              );
            }

            return acc;
          },
          []
        )}
      </Container>
    );
  }
}

export { SplitPanels, SplitPanelsProps };
