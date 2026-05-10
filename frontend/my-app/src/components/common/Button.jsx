import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-primary text-primary-content hover:bg-primary/90 shadow-lg shadow-primary/30',
      secondary: 'bg-secondary text-secondary-content hover:bg-secondary/90 shadow-lg shadow-secondary/30',
      outline: 'border border-primary text-primary hover:bg-primary/10',
      ghost: 'hover:bg-primary/10 text-primary',
    };

    const sizes = {
      default: 'h-11 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-14 rounded-md px-8 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
