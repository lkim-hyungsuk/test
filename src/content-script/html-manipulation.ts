import { ILT_ENABLED_CLASS } from '../common/constants';

const HIGHLIGHT_CLASSES = ['!tw-bg-red-600/50', '!tw-shadow', '!tw-shadow-white/5'];
/**
 * Find all the strings with `data-ilt` attribute and transform them
 */
export const transformIltSpans = (doc: Document) => {
  const stringMarkers = document.querySelectorAll('span[data-ilt="start"]');
  stringMarkers.forEach((el) => {
    replaceMarkerSpans(el as HTMLElement, doc);
  });
};

/**
 * Process any HTML of this format
 * ```
 * <span data-ilt="start"></span>...<span data-ilt="end"></span>
 * ```
 * into a single <span> with metadata about the ilt string.
 *
 * <span data-ilt="start" data-ns="${ns}" data-key="${key}" fingerprint="${fingerprint}">${result}</span>
 * <span data-ilt="end"></span>
 */
export const replaceMarkerSpans = (stringEl: HTMLElement, doc: Document): HTMLElement | null => {
  const span = doc.createElement('span');
  span.classList.add(ILT_ENABLED_CLASS);
  span.classList.add(...HIGHLIGHT_CLASSES);
  span.setAttribute('data-ilt-string', encodeURIComponent(JSON.stringify(stringEl.dataset.ilt)));
  span.setAttribute('data-fingerprint', stringEl.dataset.fingerprint);
  span.setAttribute('data-source', stringEl.dataset.source);
  span.setAttribute('data-hash', stringEl.dataset.hash);
  const stringNodes = [];
  let nextSibling = stringEl.nextSibling as HTMLElement;
  while (
    nextSibling &&
    (!nextSibling.tagName || (nextSibling.tagName !== 'span' && nextSibling.dataset.ilt !== 'end'))
  ) {
    stringNodes.push(nextSibling);
    nextSibling = nextSibling.nextSibling as HTMLElement;
  }
  stringNodes.forEach((n) => {
    span.appendChild(n);
  });
  // <span class="ilt-enabled" data-ilt-string="%22start%22">Text</span>
  stringEl.replaceWith(span);
  return span;
};
