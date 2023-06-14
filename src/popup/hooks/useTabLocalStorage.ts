import { LocalStorageKey } from '../../common/constants';
import browser from 'webextension-polyfill';
import { useState, useEffect } from 'react';
import { InternalMessageType } from '../../common/constants';

export function useTabLocalStorage(key: LocalStorageKey): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>();

  useEffect(() => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      const currentTab = tabs[0];
      browser.tabs
        .sendMessage(currentTab.id, {
          type: InternalMessageType.getLocalStorage,
          payload: {
            key,
          },
        })
        .then((res) => {
          setStoredValue(res);
        });
    });
  }, []); // Empty dependency array ensures the effect runs only once

  const setValue = (value: string) => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      const currentTab = tabs[0];
      browser.tabs
        .sendMessage(currentTab.id, {
          type: InternalMessageType.setLocalStorage,
          payload: {
            key,
            value,
          },
        })
        .then(() => {
          setStoredValue(value);
        });
    });
  };

  return [storedValue, setValue];
}
