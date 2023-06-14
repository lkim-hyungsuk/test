import React, { useRef, useEffect } from 'react';

const expandTextarea = (el: HTMLElement) => {
  if (el && el.scrollHeight && el.clientHeight) {
    el.style.height = `${el.scrollHeight}px`;
  }
};

const InlineTextarea = ({ ...props }) => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textarea && textarea.current) {
      expandTextarea(textarea.current);
    }
  });

  const incomingClasses = props.className;

  delete props.className;
  return (
    <textarea
      className={`
        tw-py-2
        tw-px-3
        tw-h-8
        tw-box-border
        tw-rounded-sm
        tw-border-0
        tw-font-sans
        tw-shadow-inner
        tw-shadow-black/30
        disabled:tw-opacity-50
        disabled:tw-bg-black/10
        disabled:tw-border-none
        disabled:tw-shadow-none
        ${incomingClasses}
      `}
      ref={textarea}
      onInput={(evt) => {
        if (textarea.current) {
          expandTextarea(textarea.current);
        }
        props.onInput && props.onInput(evt);
      }}
      {...props}
    ></textarea>
  );
};

export default InlineTextarea;
