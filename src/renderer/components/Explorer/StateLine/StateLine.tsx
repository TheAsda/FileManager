import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border-top: 1px solid black;
`;

interface StateLineProps {
  count: number;
}

const StateLine = (props: StateLineProps) => {
  return <Container>Count: {props.count}</Container>;
};

export { StateLine };
