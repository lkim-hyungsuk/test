import { ILT_ENABLED_CLASS } from '../common/constants';
import { replaceMarkerSpans } from './html-manipulation';

const HIGHLIGHT_CLASSES = ['!tw-bg-red-600/50', '!tw-shadow', '!tw-shadow-white/5'];
/**
 * @function findPlaceholders
 * @summary Find all elements that have placeholders (or data-placeholders,
 * in the case of content editable elements) that have ILT spans
 * inside of the (data-)placeholder attribute, then update the element and
 * placeholder so the placeholder can be edited.
 */
export const findPlaceholders = (doc: Document) => {
  Array.from(
    doc.querySelectorAll(
      '[placeholder*="data-ilt"], [data-placeholder*="data-ilt"], [data-overflow-text*="data-ilt"]'
    )
  ).map((el) => {
    const isPlaceholder = el.getAttribute('placeholder');
    const isDataplaceholder = el.getAttribute('data-placeholder');
    const iltAttribute = isPlaceholder
      ? 'placeholder'
      : isDataplaceholder
      ? 'data-placeholder'
      : 'data-overflow-text';
    const spanText = el.getAttribute(iltAttribute);
    if (spanText) {
      const tempContainer = doc.createElement('div');
      // The tempContainer is never appended to the DOM, so the XSS risk is removed
      tempContainer.innerHTML = spanText;
      const startSpan = tempContainer.querySelector('[data-ilt="start"]');
      if (startSpan) {
        const span = replaceMarkerSpans(startSpan as HTMLElement, doc);
        if (span) {
          const original = span.innerHTML;
          el.classList.add(ILT_ENABLED_CLASS);
          const attrs: Record<string, string> = {
            [iltAttribute]: original,
            'data-ilt': span.dataset.ilt,
            'data-fingerprint': span.dataset.fingerprint,
            'data-ilt-placeholder': isPlaceholder ? 'placeholder' : 'data-placeholder',
          };
          setAttributesOnElement(el as HTMLElement, attrs);
          el.classList.add(...HIGHLIGHT_CLASSES);
          if (!isPlaceholder) {
            let parent: HTMLElement | null = el as HTMLElement;
            let bounds = el.getBoundingClientRect();
            while (parent && (!bounds.height || !bounds.width)) {
              parent = parent.parentElement;
              if (parent) {
                bounds = parent.getBoundingClientRect();
              }
            }
            if (parent) {
              const existingOverlay = parent.querySelector('span[data-ilt-overlay]');
              if (!existingOverlay) {
                // Add an overlay to the element to handle highlighting
                span.innerHTML = '';
                span.setAttribute('data-ilt-overlay', 'true');
                span.style.position = 'absolute';
                span.style.top = '0';
                span.style.left = '0';
                span.style.height = `${bounds.height}px`;
                span.style.width = `${bounds.width}px`;
                parent.appendChild(span);
              }
            }
          }
        }
      }
    }
  });
};

export const setAttributesOnElement = (el: HTMLElement, attributes: Record<string, string>) => {
  Object.keys(attributes).forEach((key) => {
    if (attributes[key] !== null && attributes[key] !== undefined) {
      el.setAttribute(key, attributes[key]);
    }
  });
};
