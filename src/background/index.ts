import { GetCurrentTabUrlMessage } from '../ilt/api';
import { load } from './load';
import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener(
  (message: GetCurrentTabUrlMessage, sender: browser.Runtime.MessageSender) => {
    return new Promise((resolve) => {
      if (message.type === 'getCurrentTabUrl') {
        const url = sender.tab?.url;
        resolve({ url });
      }
    });
  }
);

load();
