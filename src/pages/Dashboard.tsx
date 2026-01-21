import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../hooks/useTransactions'
import { usePortfolioPerformance } from '../hooks/usePortfolioPerformance'
import { useDepositRequests } from '../hooks/useDepositRequests'
import { useWithdrawalRequests } from '../hooks/useWithdrawalRequests'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  DollarSign,
  Percent,
  Clock,
  ArrowRight,
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Dashboard() {
  const { profile } = useAuth()
  const { transactions } = useTransactions()
  const { latestPerformance } = usePortfolioPerformance()
  const { requests: depositRequests } = useDepositRequests()
  const { requests: withdrawalRequests } = useWithdrawalRequests()

  const pendingDeposits = depositRequests.filter((r) => r.status === 'pending').length
  const pendingWithdrawals = withdrawalRequests.filter((r) => r.status === 'pending').length
  const recentTransactions = transactions.slice(0, 5)

  const portfolioValue = profile?.balance || 0
  const totalDeposits = profile?.total_deposits || 0
  const totalProfits = profile?.total_profits || 0
  const roiPercent = totalDeposits > 0 ? ((portfolioValue - totalDeposits) / totalDeposits) * 100 : 0

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Welcome back, {profile?.full_name || 'Investor'}
        </h1>
        <p className="text-slate-400">
          Here's an overview of your investment portfolio.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Portfolio Value</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {formatCurrency(portfolioValue)}
                </p>
                {latestPerformance && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    latestPerformance.daily_change_percent >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {latestPerformance.daily_change_percent >= 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{formatPercent(latestPerformance.daily_change_percent)} today</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Wallet className="text-primary-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Deposits</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {formatCurrency(totalDeposits)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                  <Activity size={16} />
                  <span>Lifetime deposits</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <ArrowDownToLine className="text-emerald-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Profits</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {formatCurrency(totalProfits)}
                </p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  totalProfits >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  <DollarSign size={16} />
                  <span>Credited earnings</span>
                </div>
              </div>
              <div className="p-3 bg-accent-500/20 rounded-xl">
                <TrendingUp className="text-accent-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total ROI</p>
                <p className={`text-2xl lg:text-3xl font-bold ${
                  roiPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatPercent(roiPercent)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                  <Percent size={16} />
                  <span>Return on investment</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Percent className="text-yellow-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
              <p className="text-sm text-slate-400">Your latest account activity</p>
            </div>
            <Link to="/transactions">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'deposit' || transaction.type === 'profit_credit'
                          ? 'bg-emerald-500/20'
                          : 'bg-red-500/20'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'profit_credit' ? (
                          <ArrowDownToLine className="text-emerald-400" size={20} />
                        ) : (
                          <ArrowUpFromLine className="text-red-400" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {transaction.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-slate-400">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'deposit' || transaction.type === 'profit_credit'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'profit_credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Activity size={40} className="mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Pending Requests</h2>
            <p className="text-sm text-slate-400">Awaiting processing</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Pending Deposits</span>
                <span className="text-2xl font-bold text-white">{pendingDeposits}</span>
              </div>
              <Link to="/deposit">
                <Button variant="outline" size="sm" fullWidth>
                  <ArrowDownToLine size={16} />
                  New Deposit
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Pending Withdrawals</span>
                <span className="text-2xl font-bold text-white">{pendingWithdrawals}</span>
              </div>
              <Link to="/withdraw">
                <Button variant="outline" size="sm" fullWidth>
                  <ArrowUpFromLine size={16} />
                  New Withdrawal
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-primary-400 mb-2">
                <Clock size={16} />
                <span className="text-sm font-medium">Processing Time</span>
              </div>
              <p className="text-sm text-slate-400">
                Requests are typically processed within 1-3 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Activity className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Simulated Performance Data
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                All financial figures displayed on this dashboard are simulated or internally managed.
                This platform operates as an investment performance dashboard and does not execute real trades.
                Values shown are for informational and tracking purposes only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}
