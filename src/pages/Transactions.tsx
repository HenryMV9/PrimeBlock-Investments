import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useDepositRequests } from '../hooks/useDepositRequests'
import { useWithdrawalRequests } from '../hooks/useWithdrawalRequests'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import TransactionModal from '../components/TransactionModal'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Activity,
  Filter,
  Search,
  ChevronRight,
  Hash,
} from 'lucide-react'

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

type TabType = 'all' | 'deposits' | 'withdrawals'

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

export default function Transactions() {
  const { transactions, loading: transactionsLoading } = useTransactions()
  const { requests: depositRequests, loading: depositsLoading } = useDepositRequests()
  const { requests: withdrawalRequests, loading: withdrawalsLoading } = useWithdrawalRequests()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null)

  const loading = transactionsLoading || depositsLoading || withdrawalsLoading

  const allItems: TransactionItem[] = [
    ...transactions.map((t) => ({
      id: t.id,
      type: t.type as string,
      amount: t.amount,
      status: t.status,
      description: t.description,
      date: t.created_at,
      category: 'transaction' as const,
    })),
    ...depositRequests.map((d) => ({
      id: d.id,
      transactionId: d.transaction_id,
      type: 'deposit_request',
      amount: d.amount,
      status: d.status,
      description: `${d.payment_method?.replace('_', ' ')} - ${d.reference_number || 'Pending'}`,
      date: d.created_at,
      category: 'deposit' as const,
      paymentMethod: d.payment_method,
      notes: d.notes,
      referenceNumber: d.reference_number,
    })),
    ...withdrawalRequests.map((w) => ({
      id: w.id,
      transactionId: w.transaction_id,
      type: 'withdrawal_request',
      amount: w.amount,
      status: w.status,
      description: `${w.withdrawal_method?.replace('_', ' ')}`,
      date: w.created_at,
      category: 'withdrawal' as const,
      paymentMethod: w.withdrawal_method,
      notes: w.notes,
      accountDetails: w.account_details,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredItems = allItems.filter((item) => {
    if (activeTab === 'deposits' && !['deposit', 'deposit_request', 'profit_credit'].includes(item.type)) {
      return false
    }
    if (activeTab === 'withdrawals' && !['withdrawal', 'withdrawal_request'].includes(item.type)) {
      return false
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.type.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        formatCurrency(item.amount).toLowerCase().includes(query) ||
        item.transactionId?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      profit_credit: 'Profit Credit',
      balance_adjustment: 'Balance Adjustment',
      deposit_request: 'Deposit Request',
      withdrawal_request: 'Withdrawal Request',
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    if (['deposit', 'deposit_request', 'profit_credit'].includes(type)) {
      return <ArrowDownToLine className="text-emerald-400" size={20} />
    }
    if (['withdrawal', 'withdrawal_request'].includes(type)) {
      return <ArrowUpFromLine className="text-red-400" size={20} />
    }
    return <DollarSign className="text-primary-400" size={20} />
  }

  const getTypeColor = (type: string): string => {
    if (['deposit', 'deposit_request', 'profit_credit'].includes(type)) {
      return 'bg-emerald-500/20'
    }
    if (['withdrawal', 'withdrawal_request'].includes(type)) {
      return 'bg-red-500/20'
    }
    return 'bg-primary-500/20'
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Transaction History
        </h1>
        <p className="text-slate-400">
          View all your deposits, withdrawals, and account activity. Click any transaction for details.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { key: 'all', label: 'All Transactions' },
                { key: 'deposits', label: 'Deposits & Credits' },
                { key: 'withdrawals', label: 'Withdrawals' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by ID, type, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">
            {filteredItems.length} Transaction{filteredItems.length !== 1 ? 's' : ''}
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-slate-400 mt-4">Loading transactions...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="divide-y divide-slate-700/50">
              {filteredItems.map((item) => (
                <button
                  key={`${item.category}-${item.id}`}
                  onClick={() => setSelectedTransaction(item)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{getTypeLabel(item.type)}</p>
                      {item.transactionId && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Hash size={12} />
                          <span className="font-mono">{item.transactionId}</span>
                        </div>
                      )}
                      <p className="text-sm text-slate-400 mt-1">{item.description || 'No description'}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        ['deposit', 'deposit_request', 'profit_credit'].includes(item.type)
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}>
                        {['deposit', 'deposit_request', 'profit_credit'].includes(item.type) ? '+' : '-'}
                        {formatCurrency(item.amount)}
                      </p>
                      <StatusBadge status={item.status as 'pending' | 'approved' | 'rejected'} />
                    </div>
                    <ChevronRight className="text-slate-500" size={20} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Activity size={40} className="mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm mt-2">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your transaction history will appear here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </Layout>
  )
}
