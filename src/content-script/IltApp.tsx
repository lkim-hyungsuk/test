import React, { useState } from 'react';
import { LocalStorageKey } from '../common/constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { IltFeature } from './IltFeature';

export interface FeatureProps {
  onError: (error: Error) => void;
}

export const IltApp = () => {
  const [isIltEnabled] = useLocalStorage(LocalStorageKey.iltEnabled);
  const [errors, setErrors] = useState<Error[]>([]);
  const onError = (error: Error) => {
    setErrors([...errors, error]);
  };
  return (
    <>
      {isIltEnabled ? (
        <>
          <IltFeature onError={onError} />
        </>
      ) : null}
    </>
  );
};
