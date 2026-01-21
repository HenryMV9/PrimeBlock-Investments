import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePortfolioPerformance } from '../hooks/usePortfolioPerformance'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import {
  User,
  Mail,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  CheckCircle,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Account() {
  const { profile, user, refreshProfile } = useAuth()
  const { performance } = usePortfolioPerformance()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const portfolioValue = profile?.balance || 0
  const totalDeposits = profile?.total_deposits || 0
  const totalWithdrawals = profile?.total_withdrawals || 0
  const totalProfits = profile?.total_profits || 0
  const roiPercent = totalDeposits > 0 ? ((portfolioValue - totalDeposits) / totalDeposits) * 100 : 0

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)

    if (!error) {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setEditing(false)
      }, 1500)
    }
    setSaving(false)
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Account Summary
        </h1>
        <p className="text-slate-400">
          View your account details and investment summary.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                <p className="text-sm text-slate-400">Your account details</p>
              </div>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleSave} loading={saving}>
                      {saved ? (
                        <>
                          <CheckCircle size={16} />
                          Saved
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button variant="ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className="p-3 bg-primary-500/20 rounded-xl">
                      <User className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Full Name</p>
                      <p className="text-white font-medium">{profile?.full_name || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className="p-3 bg-accent-500/20 rounded-xl">
                      <Mail className="text-accent-400" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Email Address</p>
                      <p className="text-white font-medium">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Calendar className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Member Since</p>
                      <p className="text-white font-medium">
                        {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Investment Summary</h2>
              <p className="text-sm text-slate-400">Your portfolio at a glance</p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                      <Wallet className="text-primary-400" size={20} />
                    </div>
                    <span className="text-slate-400">Portfolio Value</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <TrendingUp className="text-emerald-400" size={20} />
                    </div>
                    <span className="text-slate-400">Total Deposits</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalDeposits)}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <TrendingDown className="text-red-400" size={20} />
                    </div>
                    <span className="text-slate-400">Total Withdrawals</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalWithdrawals)}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-accent-500/20 rounded-lg">
                      <DollarSign className="text-accent-400" size={20} />
                    </div>
                    <span className="text-slate-400">Total Profits</span>
                  </div>
                  <p className={`text-2xl font-bold ${totalProfits >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(totalProfits)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {performance.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Performance History</h2>
                <p className="text-sm text-slate-400">Recent portfolio performance</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                        <th className="text-right p-4 text-sm font-medium text-slate-400">Value</th>
                        <th className="text-right p-4 text-sm font-medium text-slate-400">Daily Change</th>
                        <th className="text-right p-4 text-sm font-medium text-slate-400">Total ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.slice(0, 10).map((record) => (
                        <tr key={record.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                          <td className="p-4 text-white">{formatDate(record.date)}</td>
                          <td className="p-4 text-right text-white font-medium">
                            {formatCurrency(record.portfolio_value)}
                          </td>
                          <td className={`p-4 text-right font-medium ${
                            record.daily_change_percent >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {formatPercent(record.daily_change_percent)}
                          </td>
                          <td className={`p-4 text-right font-medium ${
                            record.total_roi_percent >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {formatPercent(record.total_roi_percent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {profile?.full_name || 'Investor'}
              </h3>
              <p className="text-slate-400 text-sm">{profile?.email}</p>
              {profile?.is_admin && (
                <span className="inline-block mt-3 px-3 py-1 bg-accent-500/20 text-accent-400 text-sm rounded-full">
                  Administrator
                </span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">ROI Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className={`text-4xl font-bold ${roiPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPercent(roiPercent)}
                </p>
                <p className="text-slate-400 text-sm mt-1">Total Return on Investment</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Initial Investment</span>
                  <span className="text-white">{formatCurrency(totalDeposits)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Value</span>
                  <span className="text-white">{formatCurrency(portfolioValue)}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-slate-700/50">
                  <span className="text-slate-400">Net Gain/Loss</span>
                  <span className={`font-medium ${
                    portfolioValue - totalDeposits >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(portfolioValue - totalDeposits)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Shield className="text-emerald-400" size={20} />
                </div>
                <span className="font-medium text-white">Account Security</span>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>Email verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>Secure connection (HTTPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>Data encryption enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
