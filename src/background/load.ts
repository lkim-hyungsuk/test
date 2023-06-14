import browser from 'webextension-polyfill';
import { MessageType, extensionMessage } from '../common/constants';

export const load = () => {
  const listener = (message: extensionMessage, sender: any) => {
    const { messageType } = message;
    switch (messageType) {
      case MessageType.insertCSS: {
        browser.scripting.insertCSS({
          target: { tabId: sender.tab.id },
          files: [message.payload.file],
        });
        break;
      }

      case MessageType.removeCSS: {
        browser.scripting.removeCSS({
          target: { tabId: sender.tab.id },
          files: [message.payload.file],
        });
        break;
      }

      default:
        break;
    }
  };
  browser.runtime.onMessage.addListener(listener);

  return () => {
    browser.runtime.onMessage.removeListener(listener);
  };
};
