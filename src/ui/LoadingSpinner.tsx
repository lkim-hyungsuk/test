import React from 'react';
import { DotLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 60, color = '#4B5563' }) => {
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-w-full">
      <DotLoader color={color} loading size={size} />
    </div>
  );
};
