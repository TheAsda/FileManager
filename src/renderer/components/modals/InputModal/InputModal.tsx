import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './style.css';

interface InputModalProps {
  isOpened: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  initialValue: string;
  onAccept: (value: string) => void;
}

const InputModal = (props: InputModalProps) => {
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
    >
      <h1>{props.title}</h1>
      <div>
        <h2>{props.subtitle}</h2>
        <input onChange={(event) => setState(event.target.value)} value={state} />
      </div>
      <div>
        <button onClick={props.onClose}>Cancel</button>
        <button onClick={accept}>Ok</button>
      </div>
    </Modal>
  );
};

export { InputModal, InputModalProps };
