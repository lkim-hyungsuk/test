import React from 'react';
import { Home } from './Home';

// React.memo to memoize the component and prevent unnecessary re-renders
export const Popup: React.FC<{}> = React.memo(() => {
  return (
    <main className="tw-flex tw-flex-col tw-bg-slate-100 tw-shadow-md tw-text-black/90 tw-w-60 tw-p-5">
      <h2 className="tw-font-semibold tw-text-lg tw-flex tw-flex-row">
        <div>
          <img src="../icon.png" alt="ILT" className="tw-h-10" />
        </div>
        <span className="tw-ml-3 tw-text-black">Inline Translation</span>
      </h2>
      <Home />
    </main>
  );
});
