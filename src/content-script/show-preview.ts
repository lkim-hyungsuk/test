import { fromString } from '@linkedin/xmessageformat-js';

export const showPreview = (previewProposal: string, fingerprint: string, locale: string) => {
  // Add a class to the element
  const element: HTMLElement = document.querySelector(`[data-fingerprint="${fingerprint}"]`);
  element.classList.add('!tw-bg-blue-600/50');
  const hash = getHashFromElement(element);
  const updatedString = safeRenderXMessageString(previewProposal, hash, locale);
  element.innerHTML = updatedString;
  element.setAttribute('data-preview-string', updatedString);
};

export const removePreview = async (locale: string) => {
  const doc = window.document;
  getPreviewSpans(doc).forEach((el) => {
    el.removeAttribute('data-preview-string');
    el.classList.remove('!tw-bg-blue-600/50');
    const original = decodeURIComponent(el.dataset.source || '');
    const hash = getHashFromElement(el);
    const originalString = safeRenderXMessageString(original, hash, locale);
    el.innerHTML = originalString;
  });
};

const getPreviewSpans = (doc: Document): Array<HTMLElement> => {
  return Array.from(doc.querySelectorAll('[data-preview-string]'));
};

const getHashFromElement = (el: HTMLElement) => {
  let hash = {};
  try {
    hash = JSON.parse(el.dataset.hash ? decodeURIComponent(el.dataset.hash) : '{}');
  } catch (err) {
    hash = {};
  }
  // The hash may be passed wrapped in an array for JS-rendered strings. Unwrap here.
  return Array.isArray(hash) ? hash[0] : hash;
};

const safeRenderXMessageString = (str: string, hash: any, locale?: string) => {
  try {
    return renderXMessageString(str, hash, locale);
  } catch (err) {
    // Ignore the error and return;
    return str;
  }
};

export const renderXMessageString = (str: string, hash: any, overrideLocale?: string) => {
  const renderLocale = 'en_US';
  return fromString(str, overrideLocale)([hash]);
};
