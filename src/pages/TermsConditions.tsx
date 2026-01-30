import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import Button from '../components/Button'

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FileText className="text-white" size={20} />
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
              <FileText className="text-blue-400" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
            <p className="text-slate-400">Last updated: January 30, 2026</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using the Prime Blocks investment platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you should not use our services. We reserve the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Eligibility</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                To use our platform, you must:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using our services under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all KYC and identity verification requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration and Security</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                When you create an account with Prime Blocks:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must provide accurate, current, and complete information</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>We reserve the right to suspend or terminate accounts that violate our terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Investment Services</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Prime Blocks provides an investment management platform. You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>All investments carry inherent risks, including potential loss of capital</li>
                <li>Past performance does not guarantee future results</li>
                <li>We do not provide financial advice or investment recommendations</li>
                <li>You are responsible for evaluating the suitability of any investment</li>
                <li>Investment returns are not guaranteed and may vary</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Deposits and Withdrawals</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Regarding financial transactions:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>All deposit and withdrawal requests are subject to verification and approval</li>
                <li>Processing times may vary depending on the payment method and verification requirements</li>
                <li>We reserve the right to reject or reverse any transaction that appears fraudulent</li>
                <li>You are responsible for any fees charged by third-party payment processors</li>
                <li>Minimum deposit and withdrawal amounts may apply</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. KYC and Compliance</h2>
              <p className="text-slate-300 leading-relaxed">
                We are committed to preventing fraud and complying with anti-money laundering regulations. You agree to provide accurate identification documents and information when requested. We reserve the right to suspend or terminate accounts that fail to complete KYC verification or provide false information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Prohibited Activities</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems or other user accounts</li>
                <li>Interfere with or disrupt the platform or servers</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Create multiple accounts or impersonate others</li>
                <li>Engage in market manipulation or fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Intellectual Property</h2>
              <p className="text-slate-300 leading-relaxed">
                All content, features, and functionality on the Prime Blocks platform are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-300 leading-relaxed">
                To the maximum extent permitted by law, Prime Blocks shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or investment returns. Our total liability shall not exceed the amount you paid to us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these terms, suspicious activity, or for any other reason at our discretion. Upon termination, you will be provided with instructions for withdrawing any remaining funds, subject to applicable regulations and verification requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Dispute Resolution</h2>
              <p className="text-slate-300 leading-relaxed">
                Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration in accordance with applicable arbitration rules. You waive any right to participate in class action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any legal action or proceeding shall be brought exclusively in the competent courts of the specified jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us through our support page or email us at legal@primeblocks.com.
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
