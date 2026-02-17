import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg";

    const variants = {
        primary: "bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 border-2 border-yellow-400 focus:ring-red-500",
        secondary: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 border-2 border-red-600 focus:ring-yellow-500",
        outline: "bg-transparent border-2 border-white/50 text-white hover:bg-white/10",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base min-w-[120px] min-h-[44px]", // 44px for iOS compliance
        lg: "px-8 py-4 text-xl min-w-[200px] min-h-[55px]",
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            {...props}
        >
            {children}
        </button>
    );
}
