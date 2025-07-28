import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = {
  variant: {
    primary: 'bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500',
    outline: 'border-2 border-pink-600 text-pink-600 hover:bg-pink-50 focus:ring-pink-500',
    white: 'bg-white text-pink-600 hover:bg-gray-50 focus:ring-pink-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  },
  size: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
}

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  as: Component = 'button',
  children,
  ...props 
}, ref) => {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  )
})

Button.displayName = 'Button'

export { Button }