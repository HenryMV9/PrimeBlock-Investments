import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import { ArrowLeft, Copy, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, Wallet, Bitcoin } from 'lucide-react'

type CryptoConfig = {
  name: string
  symbol: string
  settingKey: string
  icon: typeof Bitcoin
  color: string
  bgColor: string
  instructions: string[]
}

const cryptoMeta: Record<string, Omit<CryptoConfig, 'address'> & { settingKey: string }> = {
  btc: {
    name: 'Bitcoin',
    symbol: 'BTC',
    settingKey: 'wallet_btc',
    icon: Bitcoin,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    instructions: [
      'Copy the Bitcoin wallet address below',
      'Open your Bitcoin wallet app',
      'Send the exact amount in BTC equivalent to your USD deposit',
      'Make sure to use the Bitcoin network',
      "After sending, click \"I've Made the Payment\" below",
    ],
  },
  eth: {
    name: 'Ethereum',
    symbol: 'ETH',
    settingKey: 'wallet_eth',
    icon: Wallet,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    instructions: [
      'Copy the Ethereum wallet address below',
      'Open your Ethereum wallet app',
      'Send the exact amount in ETH equivalent to your USD deposit',
      'Make sure to use the Ethereum mainnet',
      "After sending, click \"I've Made the Payment\" below",
    ],
  },
  usdt: {
    name: 'USDT (TRC20)',
    symbol: 'USDT',
    settingKey: 'wallet_usdt',
    icon: Wallet,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    instructions: [
      'Copy the USDT (TRC20) wallet address below',
      'Open your USDT wallet app',
      'Send the exact amount in USDT to the address',
      'IMPORTANT: Use TRC20 network only (Tron network)',
      "After sending, click \"I've Made the Payment\" below",
    ],
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    settingKey: 'wallet_sol',
    icon: Wallet,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/20',
    instructions: [
      'Copy the Solana wallet address below',
      'Open your Solana wallet app',
      'Send the exact amount in SOL equivalent to your USD deposit',
      'Make sure to use the Solana network',
      "After sending, click \"I've Made the Payment\" below",
    ],
  },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export default function CryptoWallet() {
  const { crypto } = useParams<{ crypto: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [addressLoading, setAddressLoading] = useState(true)

  const amount = location.state?.amount as number | undefined
  const meta = crypto ? cryptoMeta[crypto.toLowerCase()] : null

  useEffect(() => {
    if (!amount || !meta) {
      navigate('/deposit')
      return
    }

    const fetchAddress = async () => {
      setAddressLoading(true)
      const { data, error: fetchError } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', meta.settingKey)
        .maybeSingle()

      if (fetchError || !data) {
        setError('Unable to load wallet address. Please try again or contact support.')
      } else {
        setWalletAddress(data.setting_value)
      }
      setAddressLoading(false)
    }

    fetchAddress()
  }, [amount, meta, navigate])

  if (!meta || !amount) {
    return null
  }

  const IconComponent = meta.icon

  const handleCopyAddress = async () => {
    if (!walletAddress) return
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePaymentConfirmation = async () => {
    if (!profile || !walletAddress) return

    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('deposit_requests')
        .insert({
          user_id: profile.id,
          amount: amount,
          payment_method: meta.symbol,
          status: 'pending',
          reference_number: '',
          notes: `Crypto deposit via ${meta.name}`,
        })

      if (insertError) throw insertError

      setSuccess(true)

      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (err) {
      console.error('Error creating deposit request:', err)
      setError('Failed to submit deposit request. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h2>
              <p className="text-slate-400 mb-4">
                Your deposit request of {formatCurrency(amount)} has been submitted successfully.
              </p>
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-left">
                <div className="flex gap-3">
                  <Info className="text-blue-400 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-400">
                    <p className="font-semibold mb-1">Pending Admin Approval</p>
                    <p>
                      Your deposit is now pending verification. Once approved by our admin team,
                      the funds will be credited to your account balance.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/deposit')}>
          <ArrowLeft size={16} />
          Back to Deposit
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 ${meta.bgColor} rounded-2xl`}>
              <IconComponent className={meta.color} size={32} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {meta.name} Deposit
              </h1>
              <p className="text-slate-400">Send {meta.symbol} to complete your deposit</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Deposit Amount</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{formatCurrency(amount)}</span>
                <span className="text-slate-400">USD</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Wallet Address</h2>
              <p className="text-sm text-slate-400">Send {meta.symbol} to this address</p>
            </CardHeader>
            <CardContent>
              {addressLoading ? (
                <div className="p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl mb-4 flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
                </div>
              ) : walletAddress ? (
                <>
                  <div className="p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl mb-4">
                    <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
                  </div>
                  <Button onClick={handleCopyAddress} fullWidth variant={copied ? 'success' : 'primary'}>
                    {copied ? (
                      <>
                        <CheckCircle size={20} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        Copy Wallet Address
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  Wallet address unavailable. Please contact support.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Instructions</h2>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {meta.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full ${meta.bgColor} ${meta.color} flex items-center justify-center text-xs font-bold`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-slate-300">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertCircle className="text-amber-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Important Notice</h4>
                  <p className="text-sm text-slate-400">
                    Make sure you send the payment to the correct address and network. Sending to
                    the wrong address or network may result in permanent loss of funds. Your deposit
                    will be credited after admin verification.
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePaymentConfirmation}
                loading={loading}
                fullWidth
                size="lg"
                disabled={!walletAddress || addressLoading}
              >
                <CheckCircle size={20} />
                I've Made the Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
