import React from 'react';

export enum ButtonType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
}

interface ButtonClassTypes {
  default: Array<string>;
  muted: Array<string>;
}

interface ButtonClassGroup {
  [ButtonType.primary]: ButtonClassTypes;
  [ButtonType.secondary]: ButtonClassTypes;
  [ButtonType.tertiary]: ButtonClassTypes;
}

interface ButtonProps {
  children?: Array<React.ReactNode> | React.ReactNode;
  type?: ButtonType;
  className?: string;
  isLink?: boolean;
  disabled?: boolean;
  muted?: boolean;
  stretch?: boolean;
  iconOnly?: boolean;
  linkAttrs?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const borderColor: ButtonClassGroup = {
  [ButtonType.primary]: {
    default: ['tw-border-blue-700', 'hover:tw-border-blue-800'],
    muted: ['tw-border-black/80', 'hover:tw-border-black/90'],
  },
  [ButtonType.secondary]: {
    default: ['tw-border-blue-700', 'hover:tw-border-blue-800'],
    muted: ['tw-border tw-border-transparent'],
  },
  [ButtonType.tertiary]: {
    default: ['tw-border-transparent'],
    muted: [
      'tw-border tw-border-black/80',
      'tw-border hover:tw-border-black/90',
      'active:tw-border-black/90',
    ],
  },
};

const bgColor: ButtonClassGroup = {
  [ButtonType.primary]: {
    default: [
      'tw-bg-blue-700',
      'hover:tw-bg-blue-800',
      'active:tw-bg-blue-800',
      'disabled:tw-bg-black/10',
    ],
    muted: [
      'tw-bg-transparent',
      'hover:tw-bg-black/5',
      'active:tw-bg-black/10',
      'disabled:tw-bg-black/10',
    ],
  },
  [ButtonType.secondary]: {
    default: [
      'tw-bg-transparent',
      'hover:tw-bg-blue-500/10',
      'active:tw-bg-blue-500/20',
      'disabled:tw-bg-black/10',
    ],
    muted: [
      'tw-bg-transparent',
      'hover:tw-bg-black/5',
      'active:tw-bg-black/10',
      'disabled:tw-bg-black/10',
    ],
  },
  [ButtonType.tertiary]: {
    default: [
      'tw-bg-transparent',
      'hover:tw-bg-blue-500/10',
      'active:tw-bg-blue-500/20',
      'disabled:tw-bg-black/10',
    ],
    muted: [
      'tw-bg-black/80',
      'hover:tw-bg-black/90',
      'active:tw-bg-black/90',
      'disabled:tw-bg-black/10',
    ],
  },
};

const textColor: ButtonClassGroup = {
  [ButtonType.primary]: {
    default: ['tw-text-white', 'active:tw-text-white/50', 'disabled:tw-text-black/30'],
    muted: [
      'tw-text-black/80',
      'hover:tw-text-black/90',
      'active:tw-text-black/90',
      'disabled:tw-text-black/30',
    ],
  },
  [ButtonType.secondary]: {
    default: [
      'tw-text-blue-700',
      'hover:tw-text-blue-800',
      'active:tw-text-blue-800',
      'disabled:tw-text-black/30',
      'hover:disabled:tw-text-black/30',
    ],
    muted: [
      'tw-text-black/80',
      'hover:tw-text-black/90',
      'active:tw-text-black/90',
      'disabled:tw-text-black/30',
    ],
  },
  [ButtonType.tertiary]: {
    default: ['tw-text-blue-700', 'hover:tw-text-blue-800', 'disabled:tw-text-black/30'],
    muted: [
      'tw-text-white',
      'hover:tw-text-white',
      'active:tw-tex-white/60',
      'disabled:tw-text-black/30',
    ],
  },
};

export const Button = React.forwardRef<any, ButtonProps & React.HTMLProps<HTMLButtonElement>>(
  (
    {
      children,
      className,
      type = ButtonType.primary,
      isLink = false,
      linkAttrs,
      disabled,
      muted,
      stretch,
      iconOnly,
      onClick,
      ...props
    },
    ref
  ) => {
    const state = muted ? 'muted' : 'default';
    const classes = Array.from(
      new Set([
        ...(className || '').split(' '),
        'tw-flex',
        'tw-items-center',
        'tw-justify-center',
        'tw-text-center',
        'tw-rounded-full',
        'tw-border',
        'tw-border-solid',
        ...textColor[type][state],
        ...borderColor[type][state],
        ...bgColor[type][state],
        'tw-cursor-pointer',
        'tw-font-sans',
        'tw-font-medium',
        'tw-px-4',
        stretch ? 'tw-w-full' : null,
        'tw-py-1.5',
        'disabled:tw-border-none',
      ])
    )
      .filter((c) => c)
      .join(' ');
    return isLink ? (
      <a className={classes} {...linkAttrs} ref={ref}>
        {children}
      </a>
    ) : (
      <button ref={ref} className={classes} disabled={disabled} onClick={onClick} {...props}>
        {children}
      </button>
    );
  }
);
