import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDepositRequests } from '../hooks/useDepositRequests'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import StatusBadge from '../components/StatusBadge'
import {
  ArrowDownToLine,
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
  CreditCard,
  Building2,
  Banknote,
} from 'lucide-react'

const paymentMethods = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'wire_transfer', label: 'Wire Transfer' },
  { value: 'crypto', label: 'Cryptocurrency' },
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
  const { profile } = useAuth()
  const { requests, loading } = useDepositRequests()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (profile && (numAmount < profile.plan_min_amount || numAmount > profile.plan_max_amount)) {
      setError(`Amount must be between ${formatCurrency(profile.plan_min_amount)} and ${formatCurrency(profile.plan_max_amount)} for your plan`)
      return
    }

    const paymentMethodMap: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      wire_transfer: 'Wire Transfer',
      crypto: 'Cryptocurrency',
    }

    const message = `*Deposit Request*\n\n` +
      `Name: ${profile?.full_name || 'N/A'}\n` +
      `Email: ${profile?.email || 'N/A'}\n` +
      `Amount: $${numAmount.toFixed(2)}\n` +
      `Payment Method: ${paymentMethodMap[paymentMethod] || paymentMethod}\n` +
      `Reference Number: ${referenceNumber || 'N/A'}\n` +
      `Notes: ${notes || 'N/A'}`

    const whatsappUrl = `https://wa.me/17013173882?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
                    <p className="font-semibold">Deposit Limit</p>
                    <p className="text-sm">Your plan allows deposits between {formatCurrency(profile.plan_min_amount)} and {formatCurrency(profile.plan_max_amount)}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <Select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={paymentMethods}
                />

                <Input
                  label="Reference Number (Optional)"
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Transaction or reference number"
                  helpText="Enter any reference number from your payment"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information about your deposit"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                  />
                </div>

                <Button type="submit" fullWidth>
                  <ArrowDownToLine size={20} />
                  Continue to WhatsApp
                </Button>
              </form>
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
              <h3 className="font-semibold text-white">Payment Instructions</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Building2 size={18} />
                  <span className="font-medium">Bank Transfer</span>
                </div>
                <p className="text-sm text-slate-400">
                  Contact support to receive bank transfer details.
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Banknote size={18} />
                  <span className="font-medium">Wire Transfer</span>
                </div>
                <p className="text-sm text-slate-400">
                  International wire transfers accepted. Contact support for SWIFT details.
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <CreditCard size={18} />
                  <span className="font-medium">Cryptocurrency</span>
                </div>
                <p className="text-sm text-slate-400">
                  BTC, ETH, USDT accepted. Contact support for wallet addresses.
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
