const fullMatchString = '<span data-ilt="';
const partialMatchString = ' data-ilt="';
export const cleanupEncodedIlt = () => {
  /**
   * @function cleanupEncodedIlt
   * @summary Sometimes the result of a t-helper is sent directly into another component,
   * which escapes the string. This function decode first to restore its original form. This is done
   * by setting the innerHTML property of the target element to the encoded value, which would cause
   * the browser to automatically decode it and render it as normal HTML content.
   */
  const _cleanupEncodedIlt = () => {
    const walker = window.document.createTreeWalker(window.document.body, NodeFilter.SHOW_TEXT);
    let node;
    const changes = [];
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.indexOf(fullMatchString) !== -1) {
        const endIndex = node.textContent.indexOf(
          '</span>',
          node.textContent.indexOf(fullMatchString)
        );
        if (endIndex !== -1) changes.push(node);
      } else if (node.textContent && node.textContent.indexOf(partialMatchString) !== -1) {
        const parent = node.parentElement;
        if (parent) {
          parent.querySelectorAll('br').forEach((el) => el.remove());
          parent.textContent = Array.from(parent.childNodes).reduce((res, n) => {
            res = `${res} ${n.textContent}`;
            return res;
          }, '');
        }
      }
    }
    changes.forEach((node) => {
      const span = document.createElement('span');
      const parent = node.parentNode as HTMLElement;
      if (node && node.textContent) {
        span.innerHTML = node.textContent;
        parent.replaceChild(span, node);
      }
    });
  };

  return window.setInterval(_cleanupEncodedIlt, 300);
};
