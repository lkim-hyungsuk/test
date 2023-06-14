import { cleanupEncodedIlt } from './cleanup-encoded-ilt';
import { findPlaceholders } from './find-placeholders';
import { transformIltSpans } from './html-manipulation';

let documents = [window.document];
const _findIlt = () => {
  // since content on the page is dynamic, we need to keep searching and transform ilt
  return (
    window.setInterval(() => {
      documents.forEach((doc) => {
        transformIltSpans(doc);
        findPlaceholders(doc);
        cleanupEncodedIlt();
      });
    }),
    700
  );
};

export const findIlt: (x: boolean) => number = () => {
  return _findIlt();
};
