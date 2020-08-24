import React, { useEffect, useRef } from 'react';
import { Modal } from 'react-responsive-modal';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';
import 'react-responsive-modal/styles.css';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = () => {
    if (inputRef.current) {
      props.onAccept(inputRef.current.value);
    }
  };

  useEffect(() => {
    if (inputRef.current && props.initialValue) {
      inputRef.current.value = props.initialValue;
    }
  }, [props.initialValue]);

  return (
    <Modal
      onClose={props.onClose}
      open={props.isOpened}
      showCloseIcon={false}
      styles={{
        modal: {
          padding: '10px',
          color: theme['palette.textColor'],
          backgroundColor: theme['palette.backgroundColor'],
        },
      }}
      closeOnEsc
      closeOnOverlayClick
    >
      <Title {...theme}>{props.title}</Title>
      <Content>
        <SubHeader {...theme}>{props.subtitle}</SubHeader>
        <Input {...theme} ref={inputRef} autoFocus />
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
