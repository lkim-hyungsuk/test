import { useEffect, useState } from 'react';
import { LocalStorageKey } from '../../common/constants';

export function useLocalStorage(key: LocalStorageKey): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    const res = window.localStorage.getItem(key);
    return res;
  });

  useEffect(() => {
    const poller = setInterval(() => {
      const res = window.localStorage.getItem(key);
      setStoredValue(res);
    }, 1000);

    return () => {
      window.clearInterval(poller);
    };
  });

  const setValue = (value: string) => {
    window.localStorage.setItem(key, value);
    setStoredValue(value);
  };
  return [storedValue, setValue];
}
