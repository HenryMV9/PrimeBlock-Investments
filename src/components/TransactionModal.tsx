import { useNavigate } from 'react-router-dom'
import {
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  MessageSquare,
  Calendar,
  Hash,
  CreditCard,
  FileText,
} from 'lucide-react'
import Button from './Button'
import StatusBadge from './StatusBadge'

interface TransactionItem {
  id: string
  transactionId?: string
  type: string
  amount: number
  status: string
  description: string
  date: string
  category: 'transaction' | 'deposit' | 'withdrawal'
  paymentMethod?: string
  notes?: string
  accountDetails?: string
  referenceNumber?: string
}

interface TransactionModalProps {
  transaction: TransactionItem | null
  onClose: () => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const typeLabels: Record<string, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  profit_credit: 'Profit Credit',
  balance_adjustment: 'Balance Adjustment',
  deposit_request: 'Deposit Request',
  withdrawal_request: 'Withdrawal Request',
}

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  wire_transfer: 'Wire Transfer',
  crypto: 'Cryptocurrency',
}

export default function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  const navigate = useNavigate()

  if (!transaction) return null

  const isCredit = ['deposit', 'deposit_request', 'profit_credit'].includes(transaction.type)

  const handleContactSupport = () => {
    const transactionInfo = `
Transaction ID: ${transaction.transactionId || transaction.id}
Type: ${typeLabels[transaction.type] || transaction.type}
Amount: ${formatCurrency(transaction.amount)}
Status: ${transaction.status}
Date: ${formatDate(transaction.date)}
${transaction.paymentMethod ? `Payment Method: ${paymentMethodLabels[transaction.paymentMethod] || transaction.paymentMethod}` : ''}
${transaction.referenceNumber ? `Reference: ${transaction.referenceNumber}` : ''}
`.trim()

    const subject = transaction.type.includes('deposit') ? 'deposit' : 'withdrawal'

    navigate('/support', {
      state: {
        prefillSubject: subject,
        prefillMessage: `I need assistance with the following transaction:\n\n${transactionInfo}\n\nDescription of issue:\n`,
      },
    })
    onClose()
  }

  const getTypeIcon = () => {
    if (isCredit) {
      return <ArrowDownToLine className="text-emerald-400" size={24} />
    }
    return <ArrowUpFromLine className="text-red-400" size={24} />
  }

  const getTypeColor = () => {
    if (isCredit) {
      return 'bg-emerald-500/20'
    }
    return 'bg-red-500/20'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Transaction Details</h2>
              <p className="text-sm text-slate-400">{typeLabels[transaction.type] || transaction.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {transaction.transactionId && (
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Hash size={16} />
                <span className="text-sm">Transaction ID</span>
              </div>
              <p className="text-white font-mono text-lg">{transaction.transactionId}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <DollarSign size={16} />
                <span className="text-sm">Amount</span>
              </div>
              <p className={`text-xl font-bold ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <FileText size={16} />
                <span className="text-sm">Status</span>
              </div>
              <div className="mt-1">
                <StatusBadge status={transaction.status as 'pending' | 'approved' | 'rejected'} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar size={16} />
              <span className="text-sm">Date & Time</span>
            </div>
            <p className="text-white">{formatDate(transaction.date)}</p>
          </div>

          {transaction.paymentMethod && (
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <CreditCard size={16} />
                <span className="text-sm">Payment Method</span>
              </div>
              <p className="text-white">
                {paymentMethodLabels[transaction.paymentMethod] || transaction.paymentMethod}
              </p>
            </div>
          )}

          {transaction.referenceNumber && (
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Hash size={16} />
                <span className="text-sm">Reference Number</span>
              </div>
              <p className="text-white font-mono">{transaction.referenceNumber}</p>
            </div>
          )}

          {transaction.accountDetails && (
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <CreditCard size={16} />
                <span className="text-sm">Account Details</span>
              </div>
              <p className="text-white">{transaction.accountDetails}</p>
            </div>
          )}

          {transaction.notes && (
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <FileText size={16} />
                <span className="text-sm">Notes</span>
              </div>
              <p className="text-white">{transaction.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700">
          <Button onClick={handleContactSupport} variant="outline" fullWidth>
            <MessageSquare size={18} />
            Contact Support About This Transaction
          </Button>
        </div>
      </div>
    </div>
  )
}
