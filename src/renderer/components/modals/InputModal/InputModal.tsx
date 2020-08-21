import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';

const Title = styled.h1<Theme>`
  font-size: ${(props) => props['palette.fontSize'] * 1.5}px;
`;

const Button = styled.button<Theme>`
  background-color: ${(props) => props['palette.backgroundColor']};
  font-size: ${(props) => props['palette.fontSize']}px;
  color: ${(props) => props['palette.textColor']};
`;

const Content = styled.div`
  margin: 10px 0;
`;

const SubHeader = styled.h2<Theme>`
  font-size: ${(props) => props['palette.fontSize'] * 1.2}px;
`;

const Input = styled.input<Theme>`
  background-color: ${(props) => props['palette.additionalColor']};
`;

const Footer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

interface InputModalProps {
  isOpened: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  initialValue?: string;
  onAccept: (value: string) => void;
}

const InputModal = (props: InputModalProps) => {
  const { theme } = useTheme();
  const [state, setState] = useState<string>(props.initialValue ?? '');

  const accept = () => {
    props.onAccept(state);
  };

  useEffect(() => {
    if (props.initialValue) {
      setState(props.initialValue);
    }
  }, [props.initialValue]);

  return (
    <Modal
      ariaHideApp={false}
      isOpen={props.isOpened}
      onRequestClose={props.onClose}
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          padding: '10px',
          color: theme['palette.textColor'],
          backgroundColor: theme['palette.backgroundColor'],
          top: '50%',
          left: '50%',
          bottom: undefined,
          right: undefined,
          transform: 'translate(-50%,-50%)',
        },
      }}
    >
      <Title {...theme}>{props.title}</Title>
      <Content>
        <SubHeader {...theme}>{props.subtitle}</SubHeader>
        <Input
          {...theme}
          onChange={(event) => setState(event.target.value)}
          value={state}
          autoFocus
        />
      </Content>
      <Footer>
        <Button {...theme} onClick={props.onClose}>
          Cancel
        </Button>
        <Button {...theme} onClick={accept}>
          Ok
        </Button>
      </Footer>
    </Modal>
  );
};

export { InputModal, InputModalProps };
