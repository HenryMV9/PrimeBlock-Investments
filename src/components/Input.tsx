import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {helpText && !error && (
          <p className="text-sm text-slate-500">{helpText}</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
