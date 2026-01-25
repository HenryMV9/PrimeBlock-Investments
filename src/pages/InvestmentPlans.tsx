import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Shield, Zap, Crown, Check } from 'lucide-react'
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
  color: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Growth Plan',
    icon: Shield,
    investmentRange: '$100 – $1,000',
    minAmount: 100,
    maxAmount: 1000,
    summary: 'Entry-level, low-risk crypto investment for beginners',
    features: [
      'Diversified crypto portfolio',
      'Low-risk trading strategies',
      'Weekly monitoring & market insights',
      'Capital protection focus',
      '24/7 customer support'
    ],
    target: 'Steady short-term growth',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'smart',
    name: 'Smart Builder Plan',
    icon: TrendingUp,
    investmentRange: '$1,000 – $10,000',
    minAmount: 1000,
    maxAmount: 10000,
    summary: 'Balanced growth strategy for consistent returns',
    features: [
      'Advanced portfolio diversification',
      'Medium-risk strategies',
      'Weekly withdrawal option',
      'Professional trade management',
      'Priority customer support'
    ],
    target: 'Moderate to high growth',
    color: 'from-primary-500 to-accent-500'
  },
  {
    id: 'wealth',
    name: 'Wealth Accelerator Plan',
    icon: Zap,
    investmentRange: '$10,000 – $100,000',
    minAmount: 10000,
    maxAmount: 100000,
    summary: 'High-performance plan for experienced investors',
    features: [
      'Aggressive trading strategies',
      'Altcoins & DeFi exposure',
      'Dedicated account manager',
      'Daily market monitoring',
      'Faster withdrawal processing'
    ],
    target: 'High growth potential',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'elite',
    name: 'Elite Crypto Fund Plan',
    icon: Crown,
    investmentRange: '$100,000 – $1,000,000',
    minAmount: 100000,
    maxAmount: 1000000,
    summary: 'Institutional-grade, fully customized investment strategy',
    features: [
      'Fully customized investment strategy',
      'AI-powered trading and hedge protection',
      'Personal financial advisor',
      'Priority withdrawals',
      'Access to private investment opportunities'
    ],
    target: 'Maximum growth with controlled risk',
    color: 'from-purple-500 to-pink-500'
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
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Investment Plan
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select the plan that best fits your investment goals and risk tolerance.
            All plans include professional management and secure crypto trading.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300 ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 bg-gradient-to-br ${plan.color} rounded-xl`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Investment</p>
                    <p className="text-xl font-bold text-white">{plan.investmentRange}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                <p className="text-slate-300 mb-6">{plan.summary}</p>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="text-primary-400 flex-shrink-0 mt-1" size={18} />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-slate-400 mb-1">Target</p>
                  <p className="text-white font-semibold">{plan.target}</p>
                </div>

                <Button
                  fullWidth
                  onClick={() => handleSelectPlan(plan.id)}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
                >
                  Select {plan.name}
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
