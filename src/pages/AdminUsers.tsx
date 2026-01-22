import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import {
  Users,
  Search,
  DollarSign,
  TrendingUp,
  Wallet,
  X,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import type { User } from '../types'

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
  })
}

export default function AdminUsers() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<'balance' | 'profit' | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (profile?.is_admin) {
      fetchUsers()
    }
  }, [profile?.is_admin])

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      user.full_name.toLowerCase().includes(query)
    )
  })

  const handleAction = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !actionType || !profile) return

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return

    setProcessing(true)

    if (actionType === 'balance') {
      await supabase
        .from('profiles')
        .update({ balance: selectedUser.balance + numAmount })
        .eq('id', selectedUser.id)

      await supabase.from('transactions').insert({
        user_id: selectedUser.id,
        type: 'balance_adjustment',
        amount: Math.abs(numAmount),
        status: 'approved',
        description: description || `Balance adjustment by admin`,
        processed_at: new Date().toISOString(),
        processed_by: profile.id,
      })
    } else if (actionType === 'profit') {
      await supabase
        .from('profiles')
        .update({
          balance: selectedUser.balance + numAmount,
          total_profits: selectedUser.total_profits + numAmount,
        })
        .eq('id', selectedUser.id)

      await supabase.from('transactions').insert({
        user_id: selectedUser.id,
        type: 'profit_credit',
        amount: numAmount,
        status: 'approved',
        description: description || `Profit credit`,
        processed_at: new Date().toISOString(),
        processed_by: profile.id,
      })
    }

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setSelectedUser(null)
      setActionType(null)
      setAmount('')
      setDescription('')
    }, 1500)

    setProcessing(false)
    fetchUsers()
  }

  const closeModal = () => {
    setSelectedUser(null)
    setActionType(null)
    setAmount('')
    setDescription('')
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
          Manage Users
        </h1>
        <p className="text-slate-400">
          View and manage user accounts, balances, and credits.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Users className="text-primary-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-slate-400">Click on a user to manage their account</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-slate-400 mt-4">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-4 text-sm font-medium text-slate-400">User</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Balance</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Deposits</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Profits</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Joined</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.full_name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.full_name || 'No name'}</p>
                            <p className="text-sm text-slate-400">{user.email}</p>
                          </div>
                          {user.is_admin && (
                            <span className="px-2 py-1 bg-accent-500/20 text-accent-400 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-medium">
                        {formatCurrency(user.balance)}
                      </td>
                      <td className="p-4 text-right text-slate-300">
                        {formatCurrency(user.total_deposits)}
                      </td>
                      <td className={`p-4 text-right font-medium ${
                        user.total_profits >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(user.total_profits)}
                      </td>
                      <td className="p-4 text-right text-slate-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setActionType('balance')
                            }}
                          >
                            <Wallet size={14} />
                            Balance
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setActionType('profit')
                            }}
                          >
                            <TrendingUp size={14} />
                            Credit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {actionType === 'balance' ? 'Adjust Balance' : 'Credit Profit'}
                </h3>
                <p className="text-sm text-slate-400">{selectedUser.email}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="text-slate-400" size={20} />
              </button>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto text-emerald-400 mb-4" size={48} />
                  <p className="text-white font-medium">Action completed successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleAction} className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Current Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(selectedUser.balance)}
                    </p>
                  </div>

                  <Input
                    label={actionType === 'balance' ? 'Amount (can be negative)' : 'Profit Amount'}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    step="0.01"
                    required
                  />

                  <Input
                    label="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a note for this transaction"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" fullWidth loading={processing}>
                      <DollarSign size={16} />
                      {actionType === 'balance' ? 'Update Balance' : 'Credit Profit'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  )
}
