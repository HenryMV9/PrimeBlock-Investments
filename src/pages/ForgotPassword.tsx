import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import { AlertCircle, TrendingUp, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white">Prime Blocks</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-400" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 mb-6">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  <ArrowLeft size={20} />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Send Reset Link
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
