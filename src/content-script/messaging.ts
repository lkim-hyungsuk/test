import browser from 'webextension-polyfill';
import { InternalMessageType, ILT_ENABLED_CLASS } from '../common/constants';
import { initStyles, removeStyles } from './style';

export const initMessaging = () => {
  browser.runtime.onMessage.addListener((request, sender) => {
    switch (request.type) {
      case InternalMessageType.getLocalStorage: {
        const res = window.localStorage.getItem(request.payload.key);
        return Promise.resolve(res);
      }
      case InternalMessageType.setLocalStorage: {
        if (request.payload.value === '') {
          window.localStorage.removeItem(request.payload.key);
        } else {
          window.localStorage.setItem(request.payload.key, request.payload.value);
        }
        break;
      }
      case InternalMessageType.enable: {
        initStyles();
        document.body.classList.add(ILT_ENABLED_CLASS);
        break;
      }
      case InternalMessageType.disable: {
        removeStyles();
        document.body.classList.remove(ILT_ENABLED_CLASS);
        break;
      }
      default:
        break;
    }
  });
};
