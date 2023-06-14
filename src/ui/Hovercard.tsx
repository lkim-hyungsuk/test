import {
  arrow,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useFloating,
  autoUpdate
} from '@floating-ui/react-dom-interactions';
import React, { useRef } from 'react';

interface HovercardProps {
  children: Array<React.ReactNode> | React.ReactNode;
  target: HTMLElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  withArrow?: boolean;
  shiftPosition?: boolean;
  onSelfClose: () => void;
}
export const Hovercard = ({
  children,
  target,
  withArrow,
  className,
  side,
  shiftPosition = false,
  onSelfClose,
}: HovercardProps) => {
  const arrowRef = useRef(null);
  const { reference, floating, strategy, x, y, placement, middlewareData, context } = useFloating({
    middleware: [offset(12), flip(), shiftPosition && shift(), arrow({ element: arrowRef })].filter(
      (m) => m
    ),
    placement: side || 'right',
    strategy: 'absolute',
    whileElementsMounted: autoUpdate,
  });

  // Sometimes the target is not on the page yet. When it shows up, the full hovercard will render
  if (!target) {
    return <div />;
  } else {
    reference(target);
  }

  const arrowStaticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]];

  const { x: arrowX, y: arrowY } = middlewareData.arrow || {};
  const arrowStyles = {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    right: '',
    bottom: '',
    [arrowStaticSide]: '-4px',
  };

  const allClasses = `${className}`;

  const handleEsc = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Escape') {
      onSelfClose();
    }
  };

  return (
    <FloatingFocusManager context={context}>
      <div
        ref={floating}
        onKeyDown={handleEsc}
        className={allClasses}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          zIndex: 10000000,
        }}
      >
        {children}
        {withArrow ? (
          <div
            className="tw-absolute tw-bg-cool-gray-1000 dark:tw-bg-white tw-w-[8px] tw-h-[8px] tw-rotate-45"
            style={arrowStyles}
            ref={arrowRef}
          />
        ) : null}
      </div>
    </FloatingFocusManager>
  );
};
