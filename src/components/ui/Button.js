import { cn } from '@/lib/utils/cn'

const buttonVariants = {
  default: 'bg-pink-600 text-white hover:bg-pink-700',
  outline: 'border border-pink-600 text-pink-600 hover:bg-pink-50',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'hover:bg-pink-50 text-pink-600'
}

const buttonSizes = {
  sm: 'px-3 py-2 text-sm',
  default: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
}

export default function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  ...props 
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}