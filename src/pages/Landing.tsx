import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Shield,
  BarChart3,
  Clock,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import Button from '../components/Button'

const features = [
  {
    icon: BarChart3,
    title: 'Portfolio Tracking',
    description: 'Monitor your investment performance with real-time portfolio analytics and comprehensive ROI tracking.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your account information is protected with industry-standard security measures and encryption.',
  },
  {
    icon: Clock,
    title: 'Easy Transactions',
    description: 'Submit deposit and withdrawal requests seamlessly through our intuitive interface.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Our team of investment professionals is available to assist with your account needs.',
  },
]

const stats = [
  { value: '$50M+', label: 'Assets Under Management' },
  { value: '10,000+', label: 'Active Investors' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '24/7', label: 'Customer Support' },
]

const steps = [
  {
    step: '01',
    title: 'Create Account',
    description: 'Register with your email and complete the verification process to get started.',
  },
  {
    step: '02',
    title: 'Submit Deposit',
    description: 'Request a deposit to fund your investment account through our secure platform.',
  },
  {
    step: '03',
    title: 'Track Performance',
    description: 'Monitor your portfolio growth and investment returns through your personalized dashboard.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">Prime Blocks</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-32 lg:pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm mb-8">
              <Award size={16} />
              <span>Trusted Investment Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Professional Investment
              <span className="block text-gradient">Management Dashboard</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Track your portfolio performance, manage transactions, and monitor your investments
              all in one secure, professional platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg">
                  Start Investing
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-y border-slate-700/50 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Prime Blocks
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our platform provides everything you need to track and manage your investments effectively.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-primary-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get started with Prime Blocks in three simple steps.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500/50 to-transparent" />
                )}
                <div className="p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-gradient-to-r from-primary-900/50 to-accent-900/50 border border-primary-500/30 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <AlertTriangle className="text-yellow-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of investors tracking their portfolio performance with Prime Blocks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Create Your Account
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              Free to register
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              No hidden fees
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              Secure platform
            </span>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">Prime Blocks Investments</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center text-sm text-slate-500">
            <p>2024 Prime Blocks Investments. All rights reserved.</p>
            <p className="mt-2">
              This platform is for informational purposes only and does not constitute financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
