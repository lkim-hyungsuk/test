import React from 'react';
import ReactDOM from 'react-dom/client';
import { initMessaging } from './messaging';
import { initStyles } from './style';
import '../styles/contentScript.css';
import { IltApp } from './IltApp';

const initInlineTranslation = () => {
  const rootID = 'ilt-app-root';
  let root = document.getElementById(rootID);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', rootID);
    document.body.appendChild(root);
  }
  ReactDOM.createRoot(root).render(<IltApp></IltApp>);
};

export const load = () => {
  initInlineTranslation();
  initStyles();
  initMessaging();

  return () => {
    // Unload here
  };
};
