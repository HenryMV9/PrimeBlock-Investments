import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900'

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-600/25 focus:ring-primary-500',
    secondary: 'bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white shadow-lg shadow-accent-600/25 focus:ring-accent-500',
    outline: 'border-2 border-slate-600 text-slate-300 hover:border-primary-500 hover:text-primary-400 focus:ring-primary-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/50 focus:ring-slate-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-600/25 focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="animate-spin" />}
      {children}
    </button>
  )
}
