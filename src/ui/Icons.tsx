import browser from 'webextension-polyfill';
import React, { useEffect, useState } from 'react';

export enum IconSize {
  xsmall = '16',
  small = '24',
  medium = '36',
  large = '48',
}

export enum IconType {
  close = 'close-fill',
  add = 'add-line',
  eye = 'eye-line',
}

interface IconProps {
  type: IconType;
  size?: IconSize;
}

const svgId = 'inline-icon-svg-id';
const iconUrl = browser.runtime.getURL('remixicon.symbol.svg');

// https://css-tricks.com/ajaxing-svg-sprite/
export const loadSvgSprite = (doc: Document = window.document) => {
  return new Promise((resolve, reject) => {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', iconUrl, true);
    ajax.send();
    ajax.onload = function () {
      const div = doc.createElement('div');
      div.setAttribute('id', svgId);
      div.innerHTML = ajax.responseText;
      doc.body.insertBefore(div, doc.body.childNodes[0]);
    };
    resolve(true);
  });
};

export const Icon = ({ type, size = IconSize.small }: IconProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(!!document.getElementById(svgId));
  const [isLoading, setIsLoading] = useState<boolean>(!!document.getElementById(svgId));

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      setIsLoading(true);
      loadSvgSprite().then(() => {
        setIsLoading(false);
        setIsLoaded(true);
      });
    }
  }, [isLoaded]);
  return (
    <svg
      className={`tw-w-[${size}px] tw-h-[${size}px] tw-inline-block tw-fill-currentColor tw-border tw-border-solid tw-border-transparent`}
    >
      <use className="tw-fill-currentColor" xlinkHref={`#ri-${type}`}></use>
    </svg>
  );
};
