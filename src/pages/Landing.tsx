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
    <div className="min-h-screen bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">Prime Blocks</span>
                <span className="text-xs text-slate-400 hidden sm:block">Investments</span>
              </div>
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="shadow-lg shadow-blue-500/20">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-32 lg:pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950 z-10" />
          <img
            src="https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8 backdrop-blur-sm shadow-lg">
              <Award size={16} />
              <span className="font-medium">Trusted Investment Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Professional Investment
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Management Dashboard</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track your portfolio performance, manage transactions, and monitor your investments
              all in one secure, professional platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/investment-plans">
                <Button size="lg" className="shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40">
                  Start Investment
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-4 border-y border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/90 z-10" />
          <img
            src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-slate-300 text-sm sm:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950 z-10" />
          <img
            src="https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose Prime Blocks
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Our platform provides everything you need to track and manage your investments effectively.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
                  <feature.icon className="text-blue-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/95 z-10" />
          <img
            src="https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Get started with Prime Blocks in three simple steps.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent z-0" />
                )}
                <div className="relative z-10 p-8 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-center hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 z-10" />
          <img
            src="https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of investors tracking their portfolio performance with Prime Blocks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40">
                Create Your Account
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-slate-300">
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

      <footer className="py-12 px-4 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">Prime Blocks</span>
                <span className="text-xs text-slate-400">Investments</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-sm text-slate-500">
            <p className="text-slate-400">2025 Prime Blocks Investments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
