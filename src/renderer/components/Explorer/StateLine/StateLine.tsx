import React from 'react';

interface StateLineProps {
  count: number;
}

const StateLine = (props: StateLineProps) => {
  return <div className="explorer__footer">Count: {props.count}</div>;
};

export { StateLine };
