import browser from 'webextension-polyfill';
import { LocalStorageKey, MessageType } from '../common/constants';

export const initStyles = () => {
  if (window.localStorage.getItem(LocalStorageKey.iltEnabled) === 'true') {
    browser.runtime.sendMessage({
      messageType: MessageType.insertCSS,
      payload: {
        file: 'contentScript.css',
      },
    });
  }
};

export const removeStyles = () => {
  browser.runtime.sendMessage({
    messageType: MessageType.removeCSS,
    payload: {
      file: 'contentScript.css',
    },
  });
};
