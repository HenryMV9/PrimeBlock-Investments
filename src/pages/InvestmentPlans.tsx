import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Shield, Zap, Crown, Check, Sparkles, TrendingUpIcon } from 'lucide-react'
import Button from '../components/Button'

interface Plan {
  id: string
  name: string
  icon: typeof Shield
  investmentRange: string
  minAmount: number
  maxAmount: number
  summary: string
  features: string[]
  target: string
  expectedReturns: string
  monthlyReturns: string
  description: string
  color: string
  badge?: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Growth Plan',
    icon: Shield,
    investmentRange: '$100+',
    minAmount: 100,
    maxAmount: 1000,
    summary: 'Perfect for beginners entering the crypto investment world',
    description: 'Start your wealth-building journey with our safeguarded entry plan. Designed for newcomers, this plan offers steady growth with minimal risk exposure.',
    expectedReturns: '15-25% ROI',
    monthlyReturns: '5-8% monthly',
    features: [
      'Diversified portfolio across top 10 cryptocurrencies',
      'Conservative trading with capital protection',
      'Weekly performance reports & market insights',
      'Educational resources & investment guidance',
      '24/7 customer support',
      'No upper deposit limit - grow at your pace'
    ],
    target: 'Build wealth steadily with low risk',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Best for Beginners'
  },
  {
    id: 'smart',
    name: 'Smart Builder Plan',
    icon: TrendingUp,
    investmentRange: '$1,000+',
    minAmount: 1000,
    maxAmount: 10000,
    summary: 'Accelerated growth with balanced risk management',
    description: 'Take your portfolio to the next level with professional trading strategies designed to maximize returns while maintaining stability.',
    expectedReturns: '35-50% ROI',
    monthlyReturns: '10-15% monthly',
    features: [
      'Advanced multi-strategy trading approach',
      'Access to emerging altcoins & DeFi projects',
      'Flexible weekly withdrawal options',
      'Dedicated portfolio manager',
      'Priority support & exclusive market updates',
      'Unlimited deposit capacity'
    ],
    target: 'Consistent high returns with managed risk',
    color: 'from-primary-500 to-accent-500',
    badge: 'Most Popular'
  },
  {
    id: 'wealth',
    name: 'Wealth Accelerator Plan',
    icon: Zap,
    investmentRange: '$10,000+',
    minAmount: 10000,
    maxAmount: 100000,
    summary: 'Aggressive growth for serious wealth accumulation',
    description: 'Experience institutional-grade trading with aggressive strategies targeting maximum profit. Your dedicated account manager ensures personalized attention.',
    expectedReturns: '60-85% ROI',
    monthlyReturns: '18-25% monthly',
    features: [
      'Aggressive multi-asset trading strategies',
      'Premium DeFi & high-potential altcoin exposure',
      'Personal account manager with direct line',
      'Real-time portfolio monitoring & daily updates',
      'Express withdrawal processing (24-48hrs)',
      'No maximum deposit restrictions'
    ],
    target: 'Maximum returns for experienced investors',
    color: 'from-orange-500 to-red-500',
    badge: 'High Performance'
  },
  {
    id: 'elite',
    name: 'Elite Crypto Fund Plan',
    icon: Crown,
    investmentRange: '$100,000+',
    minAmount: 100000,
    maxAmount: 1000000,
    summary: 'Institutional-grade wealth management & exclusive opportunities',
    description: 'Join the elite tier with fully customized investment strategies, AI-powered trading, and access to exclusive opportunities unavailable to regular investors.',
    expectedReturns: '100-150% ROI',
    monthlyReturns: '25-40% monthly',
    features: [
      'Fully personalized investment strategy',
      'AI-powered algorithmic trading & hedge protection',
      'Personal financial advisor & wealth strategist',
      'Priority withdrawals & instant liquidity',
      'Exclusive pre-sale & private investment access',
      'Unlimited investment capacity - scale infinitely'
    ],
    target: 'Elite wealth creation with maximum flexibility',
    color: 'from-purple-500 to-pink-500',
    badge: 'VIP Exclusive'
  }
]

export default function InvestmentPlans() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (planId: string) => {
    sessionStorage.setItem('selectedPlan', planId)
    navigate('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-full mb-6">
            <Sparkles className="text-primary-400" size={18} />
            <span className="text-primary-400 font-semibold text-sm">Trusted by 10,000+ Investors Worldwide</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Path to Financial Freedom
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
            All plans feature professional crypto trading, secure asset management, and proven strategies to grow your wealth. Start with any amount and scale unlimited.
          </p>
          <p className="text-emerald-400 font-semibold text-xl">
            <TrendingUpIcon className="inline mr-2" size={24} />
            Average Returns: 35-150% Annual ROI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 bg-gradient-to-br ${plan.color} rounded-xl shadow-lg`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Starting From</p>
                    <p className="text-xl font-bold text-white">{plan.investmentRange}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-primary-400 font-semibold mb-3">{plan.summary}</p>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Expected Returns</p>
                    <p className="text-emerald-400 font-bold text-lg">{plan.expectedReturns}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Monthly Avg</p>
                    <p className="text-blue-400 font-bold text-lg">{plan.monthlyReturns}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="text-emerald-400 flex-shrink-0 mt-1" size={18} />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-slate-900/80 to-slate-900/60 rounded-xl p-4 mb-6 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Goal</p>
                  <p className="text-white font-semibold">{plan.target}</p>
                </div>

                <Button
                  fullWidth
                  onClick={() => handleSelectPlan(plan.id)}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg shadow-primary-500/20"
                >
                  Start Earning with {plan.name.split(' ')[0]}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
