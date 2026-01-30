import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import {
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import type { DepositRequest, WithdrawalRequest } from '../types'

interface Stats {
  totalUsers: number
  pendingDeposits: number
  pendingWithdrawals: number
  totalBalance: number
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Admin() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalBalance: 0,
  })
  const [pendingDeposits, setPendingDeposits] = useState<DepositRequest[]>([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)

    const [usersRes, depositsRes, withdrawalsRes] = await Promise.all([
      supabase.from('profiles').select('id, balance'),
      supabase
        .from('deposit_requests')
        .select(`
          *,
          user:profiles!deposit_requests_user_id_fkey(email, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('withdrawal_requests')
        .select(`
          *,
          user:profiles!withdrawal_requests_user_id_fkey(email, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
    ])

    const users = usersRes.data || []
    const deposits = depositsRes.data || []
    const withdrawals = withdrawalsRes.data || []

    setStats({
      totalUsers: users.length,
      pendingDeposits: deposits.length,
      pendingWithdrawals: withdrawals.length,
      totalBalance: users.reduce((sum, u) => sum + (u.balance || 0), 0),
    })

    setPendingDeposits(deposits)
    setPendingWithdrawals(withdrawals)
    setLoading(false)
  }

  useEffect(() => {
    if (profile?.is_admin) {
      fetchData()
    }
  }, [profile?.is_admin])

  const handleDepositAction = async (deposit: DepositRequest, action: 'approved' | 'rejected') => {
    if (!profile) return
    setProcessing(deposit.id)

    if (action === 'approved') {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('balance, total_deposits')
        .eq('id', deposit.user_id)
        .maybeSingle()

      if (userProfile) {
        await supabase
          .from('profiles')
          .update({
            balance: userProfile.balance + deposit.amount,
            total_deposits: userProfile.total_deposits + deposit.amount,
          })
          .eq('id', deposit.user_id)

        await supabase.from('transactions').insert({
          user_id: deposit.user_id,
          type: 'deposit',
          amount: deposit.amount,
          status: 'approved',
          description: `Deposit via ${deposit.payment_method}`,
          processed_at: new Date().toISOString(),
          processed_by: profile.id,
        })
      }
    }

    await supabase
      .from('deposit_requests')
      .update({
        status: action,
        processed_at: new Date().toISOString(),
        processed_by: profile.id,
      })
      .eq('id', deposit.id)

    setProcessing(null)
    fetchData()
  }

  const handleWithdrawalAction = async (withdrawal: WithdrawalRequest, action: 'approved' | 'rejected') => {
    if (!profile) return
    setProcessing(withdrawal.id)

    if (action === 'approved') {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('balance, total_withdrawals')
        .eq('id', withdrawal.user_id)
        .maybeSingle()

      if (userProfile && userProfile.balance >= withdrawal.amount) {
        await supabase
          .from('profiles')
          .update({
            balance: userProfile.balance - withdrawal.amount,
            total_withdrawals: userProfile.total_withdrawals + withdrawal.amount,
          })
          .eq('id', withdrawal.user_id)

        await supabase.from('transactions').insert({
          user_id: withdrawal.user_id,
          type: 'withdrawal',
          amount: withdrawal.amount,
          status: 'approved',
          description: `Withdrawal via ${withdrawal.withdrawal_method}`,
          processed_at: new Date().toISOString(),
          processed_by: profile.id,
        })
      }
    }

    await supabase
      .from('withdrawal_requests')
      .update({
        status: action,
        processed_at: new Date().toISOString(),
        processed_by: profile.id,
      })
      .eq('id', withdrawal.id)

    setProcessing(null)
    fetchData()
  }

  if (!profile?.is_admin) {
    return (
      <Layout>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto text-yellow-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-400">
          Manage users, deposits, and withdrawals.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Users</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Users className="text-primary-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Pending Deposits</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stats.pendingDeposits}</p>
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
                <p className="text-slate-400 text-sm mb-1">Pending Withdrawals</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stats.pendingWithdrawals}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-xl">
                <ArrowUpFromLine className="text-red-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total AUM</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{formatCurrency(stats.totalBalance)}</p>
              </div>
              <div className="p-3 bg-accent-500/20 rounded-xl">
                <DollarSign className="text-accent-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Pending Deposits</h2>
              <p className="text-sm text-slate-400">Awaiting approval</p>
            </div>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : pendingDeposits.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {pendingDeposits.slice(0, 5).map((deposit) => (
                  <div key={deposit.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {(deposit as any).user?.full_name?.charAt(0)?.toUpperCase() || (deposit as any).user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium">{formatCurrency(deposit.amount)}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {(deposit as any).user?.email || 'Unknown user'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                          {deposit.payment_method.replace('_', ' ')}
                          {deposit.reference_number && ` - ${deposit.reference_number}`}
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(deposit.created_at)}</p>
                      </div>
                      <StatusBadge status={deposit.status} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDepositAction(deposit, 'approved')}
                        loading={processing === deposit.id}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDepositAction(deposit, 'rejected')}
                        loading={processing === deposit.id}
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Activity size={40} className="mx-auto mb-4 opacity-50" />
                <p>No pending deposits</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Pending Withdrawals</h2>
              <p className="text-sm text-slate-400">Awaiting approval</p>
            </div>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : pendingWithdrawals.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {pendingWithdrawals.slice(0, 5).map((withdrawal) => (
                  <div key={withdrawal.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {(withdrawal as any).user?.full_name?.charAt(0)?.toUpperCase() || (withdrawal as any).user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium">{formatCurrency(withdrawal.amount)}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {(withdrawal as any).user?.email || 'Unknown user'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                          {withdrawal.withdrawal_method.replace('_', ' ')}
                        </p>
                        {withdrawal.account_details && (
                          <p className="text-xs text-slate-500 truncate">{withdrawal.account_details}</p>
                        )}
                        <p className="text-xs text-slate-500">{formatDate(withdrawal.created_at)}</p>
                      </div>
                      <StatusBadge status={withdrawal.status} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleWithdrawalAction(withdrawal, 'approved')}
                        loading={processing === withdrawal.id}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleWithdrawalAction(withdrawal, 'rejected')}
                        loading={processing === withdrawal.id}
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Activity size={40} className="mx-auto mb-4 opacity-50" />
                <p>No pending withdrawals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
