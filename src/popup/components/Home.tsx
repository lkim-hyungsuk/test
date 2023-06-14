import React, { useState } from 'react';
import { useTabLocalStorage } from '../hooks/useTabLocalStorage';
import { InternalMessageType, LocalStorageKey } from '../../common/constants';
import browser from 'webextension-polyfill';
import { Button, ButtonType } from '../../ui/Button';

export const Home = React.memo(() => {
  const [isIltEnabled, setIsIltEnabled] = useTabLocalStorage(LocalStorageKey.iltEnabled);
  const [isInitialActivation, setIsInitialActivation] = useState(true);

  const activate = async () => {
    if (!isIltEnabled) {
      setIsIltEnabled('true');
      const [tab] = await browser.tabs.query({ currentWindow: true, active: true });
      await browser.tabs
        .sendMessage(tab.id, { type: InternalMessageType.enable })
        .catch((error) => {
          // Handle the error
          console.error('Error activating inline translation:', error);
        });
      if (isInitialActivation) {
        await browser.tabs.reload(tab.id); // Refresh the page on initial activation
        setIsInitialActivation(false);
      }
    }
  };

  const deactivate = async () => {
    if (isIltEnabled) {
      setIsIltEnabled('');
      const [tab] = await browser.tabs.query({ currentWindow: true, active: true });
      await browser.tabs
        .sendMessage(tab.id, { type: InternalMessageType.disable })
        .catch((error) => {
          // Handle the error
          console.error('Error deactivating inline translation:', error);
        });
    }
  };

  return (
    <>
      {!!isIltEnabled ? (
        <Button type={ButtonType.primary} onClick={deactivate}>
          Deactivate Inline Translation
        </Button>
      ) : (
        <Button type={ButtonType.primary} onClick={activate}>
          Activate Inline Translation
        </Button>
      )}
    </>
  );
});
