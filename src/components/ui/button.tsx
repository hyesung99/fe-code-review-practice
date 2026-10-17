import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variantStyles = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-white border border-gray-300 hover:bg-gray-50',
  ghost: 'hover:bg-gray-100',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
