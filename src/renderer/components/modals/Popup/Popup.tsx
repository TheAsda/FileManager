import React from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const Popup = () => {
  return <ToastContainer autoClose={5000} position="bottom-center" transition={Slide} />;
};

export { Popup };
