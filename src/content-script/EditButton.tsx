import React from 'react';
import { Button, ButtonType } from '../ui/Button';

interface EditButtonProps {
  anchor: HTMLElement;
  onRemoveButton: (anchor: HTMLElement) => void;
  setCurrentAnchor: (anchor: HTMLElement) => void;
}

export const EditButton = ({ anchor, onRemoveButton, setCurrentAnchor }: EditButtonProps) => {
  const handleMouseEnter = (e: any) => {
    console.log('mouse hover event: ', e);
    e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
    const timeoutId = anchor.dataset.iltTimeoutId;
    window.clearTimeout(parseInt(timeoutId));
  };

  const handleMouseLeave = (e: any) => {
    // e.stopImmediatePropagation();
    onRemoveButton(anchor);
  };

  const handleClick = (e: any) => {
    // e.stopImmediatePropagation();
    setCurrentAnchor(anchor);
    onRemoveButton(anchor);
  };

  return (
    <Button
      type={ButtonType.primary}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      Edit
    </Button>
  );
};
