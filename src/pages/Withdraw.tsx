import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWithdrawalRequests } from '../hooks/useWithdrawalRequests'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import StatusBadge from '../components/StatusBadge'
import {
  ArrowUpFromLine,
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
  Wallet,
  AlertTriangle,
} from 'lucide-react'

const withdrawalMethods = [
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

export default function Withdraw() {
  const { profile } = useAuth()
  const { requests, createRequest } = useWithdrawalRequests()
  const [amount, setAmount] = useState('')
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank_transfer')
  const [accountDetails, setAccountDetails] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const availableBalance = profile?.balance || 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (numAmount > availableBalance) {
      setError('Withdrawal amount exceeds available balance')
      return
    }

    if (!accountDetails.trim()) {
      setError('Please provide account details for the withdrawal')
      return
    }

    setSubmitting(true)
    const { error } = await createRequest(numAmount, withdrawalMethod, accountDetails, notes)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setAmount('')
      setAccountDetails('')
      setNotes('')
      setTimeout(() => setSuccess(false), 3000)
    }
    setSubmitting(false)
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const pendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0)

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Withdraw Funds
        </h1>
        <p className="text-slate-400">
          Submit a withdrawal request from your investment account.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <ArrowUpFromLine className="text-red-400" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">New Withdrawal Request</h2>
                  <p className="text-sm text-slate-400">Fill out the form below to request a withdrawal</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <CheckCircle size={20} />
                  <span>Withdrawal request submitted successfully!</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 bg-slate-700/30 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-500/20 rounded-lg">
                        <Wallet className="text-primary-400" size={20} />
                      </div>
                      <span className="text-slate-400">Available Balance</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(availableBalance)}
                    </span>
                  </div>
                  {pendingAmount > 0 && (
                    <p className="text-sm text-yellow-400 mt-2 flex items-center gap-2">
                      <Clock size={14} />
                      {formatCurrency(pendingAmount)} pending withdrawal
                    </p>
                  )}
                </div>

                <Input
                  label="Amount (USD)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  max={availableBalance}
                  step="0.01"
                  required
                />

                <Select
                  label="Withdrawal Method"
                  value={withdrawalMethod}
                  onChange={(e) => setWithdrawalMethod(e.target.value)}
                  options={withdrawalMethods}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Account Details
                  </label>
                  <textarea
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    placeholder={
                      withdrawalMethod === 'bank_transfer'
                        ? 'Bank name, account number, routing number...'
                        : withdrawalMethod === 'crypto'
                        ? 'Wallet address, network (e.g., ERC20, TRC20)...'
                        : 'SWIFT code, bank details...'
                    }
                    rows={3}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                  />
                  <p className="text-sm text-slate-500">
                    Provide complete details for receiving your withdrawal
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information"
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  fullWidth
                  loading={submitting}
                  disabled={availableBalance <= 0}
                >
                  <ArrowUpFromLine size={20} />
                  Submit Withdrawal Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {requests.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Recent Withdrawal Requests</h2>
                <p className="text-sm text-slate-400">Your withdrawal request history</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700/50">
                  {requests.slice(0, 10).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <ArrowUpFromLine className="text-red-400" size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{formatCurrency(request.amount)}</p>
                          <p className="text-sm text-slate-400">
                            {request.withdrawal_method.replace('_', ' ')}
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
                  Total: {formatCurrency(pendingAmount)}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">Withdrawal Guidelines</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <p className="text-sm text-slate-300 font-medium mb-1">Minimum Withdrawal</p>
                <p className="text-lg text-white font-bold">$100.00</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <p className="text-sm text-slate-300 font-medium mb-1">Processing Time</p>
                <p className="text-sm text-slate-400">1-5 business days</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-xl">
                <p className="text-sm text-slate-300 font-medium mb-1">Processing Fees</p>
                <p className="text-sm text-slate-400">Varies by method</p>
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
                    Withdrawal requests are reviewed and processed within 1-5 business days.
                    You will be notified of the status.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="text-yellow-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Important Notice</h4>
                  <p className="text-sm text-slate-400">
                    Double-check your account details before submitting. Incorrect information
                    may delay your withdrawal or result in lost funds.
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
