import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import Button from '../components/Button'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">Prime Blocks</span>
                <span className="text-xs text-slate-400 hidden sm:block">Investments</span>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6">
              <Shield className="text-blue-400" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-400">Last updated: January 30, 2026</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Personal identification information (name, email address)</li>
                <li>Account credentials and authentication data</li>
                <li>Financial information related to deposits and withdrawals</li>
                <li>KYC verification documents and identification information</li>
                <li>Communication preferences and support interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Provide, maintain, and improve our investment platform services</li>
                <li>Process your transactions and manage your account</li>
                <li>Verify your identity and comply with legal requirements</li>
                <li>Send you technical notices, updates, and security alerts</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>With your consent or at your direction</li>
                <li>To comply with legal obligations and law enforcement requests</li>
                <li>To protect the rights, property, and safety of Prime Blocks and our users</li>
                <li>With service providers who perform services on our behalf</li>
                <li>In connection with a merger, sale, or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure socket layer technology, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
              <p className="text-slate-300 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate or incomplete data</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing of your data</li>
                <li>Export your data in a structured, machine-readable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-slate-300 leading-relaxed">
                We use cookies and similar tracking technologies to collect and track information about your browsing activities. You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us through our support page or email us at privacy@primeblocks.com.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft size={16} />
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
