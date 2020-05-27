import React from 'react';

interface StateLineProps {
  count: number;
}

const StateLine = (props: StateLineProps) => {
  return <div>Count: {props.count}</div>;
};

export { StateLine };
