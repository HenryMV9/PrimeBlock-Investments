import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDepositRequests } from '../hooks/useDepositRequests'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import StatusBadge from '../components/StatusBadge'
import {
  ArrowDownToLine,
  AlertCircle,
  Clock,
  Info,
  Bitcoin,
  Wallet,
} from 'lucide-react'

const paymentMethods = [
  { value: 'BTC', label: 'Bitcoin (BTC)', icon: Bitcoin },
  { value: 'ETH', label: 'Ethereum (ETH)', icon: Wallet },
  { value: 'USDT', label: 'USDT (TRC20)', icon: Wallet },
  { value: 'SOLANA', label: 'Solana (SOL)', icon: Wallet },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Deposit() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { requests, loading } = useDepositRequests()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const handleCryptoSelect = (crypto: string) => {
    setError('')

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (profile && numAmount < profile.plan_min_amount) {
      setError(`Minimum deposit amount is ${formatCurrency(profile.plan_min_amount)} for your plan`)
      return
    }

    navigate(`/deposit/${crypto.toLowerCase()}`, { state: { amount: numAmount } })
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const completedRequests = requests.filter((r) => r.status !== 'pending')

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Deposit Funds
        </h1>
        <p className="text-slate-400">
          Submit a deposit request to fund your investment account.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <ArrowDownToLine className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">New Deposit Request</h2>
                  <p className="text-sm text-slate-400">Fill out the form below to request a deposit</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {profile && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                  <Info size={20} />
                  <div>
                    <p className="font-semibold">Minimum Deposit</p>
                    <p className="text-sm">Your plan requires a minimum deposit of {formatCurrency(profile.plan_min_amount)}. You can deposit any amount above this.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                <Input
                  label="Amount (USD)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Select Cryptocurrency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => handleCryptoSelect(method.value)}
                          className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-left hover:bg-slate-700/50 hover:border-primary-500/50 transition-all group"
                        >
                          <div className="p-3 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                            <IconComponent className="text-primary-400" size={24} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{method.label}</p>
                            <p className="text-xs text-slate-400">Click to continue</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {requests.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Recent Deposit Requests</h2>
                <p className="text-sm text-slate-400">Your deposit request history</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700/50">
                  {requests.slice(0, 10).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <ArrowDownToLine className="text-emerald-400" size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{formatCurrency(request.amount)}</p>
                          <p className="text-sm text-slate-400">
                            {request.payment_method.replace('_', ' ')}
                            {request.reference_number && ` - ${request.reference_number}`}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{formatDate(request.created_at)}</p>
                        </div>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock size={20} />
                  <h3 className="font-semibold">Pending Requests</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white mb-2">{pendingRequests.length}</p>
                <p className="text-sm text-slate-400">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">How It Works</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span className="font-medium text-slate-300">Enter Amount</span>
                </div>
                <p className="text-sm text-slate-400">
                  Specify the USD amount you wish to deposit.
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="font-medium text-slate-300">Select Crypto</span>
                </div>
                <p className="text-sm text-slate-400">
                  Choose your preferred cryptocurrency (BTC, ETH, USDT, or SOL).
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span className="font-medium text-slate-300">Send Payment</span>
                </div>
                <p className="text-sm text-slate-400">
                  Transfer funds to the displayed wallet address.
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span className="font-medium text-slate-300">Confirm & Wait</span>
                </div>
                <p className="text-sm text-slate-400">
                  Confirm payment and wait for admin approval.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Info className="text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Processing Time</h4>
                  <p className="text-sm text-slate-400">
                    Deposit requests are typically processed within 1-3 business days.
                    You will be notified once your deposit is approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertCircle className="text-yellow-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Important Notice</h4>
                  <p className="text-sm text-slate-400">
                    This is a request-only system. Deposits are credited to your account
                    after verification and approval by our team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
