import React from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/prompt2app-logo.png';
interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}
const Logo = ({
  className,
  size = 'md',
  showText = true
}: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };
  return <div className={cn("flex items-center gap-2", className)}>
      
      {showText && <span className={cn("font-space-grotesk font-semibold tracking-tight text-foreground", textSizeClasses[size])}>
          Prompt2App
        </span>}
    </div>;
};
export default Logo;