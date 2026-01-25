import { useState, FormEvent } from 'react'
import { useKyc } from '../hooks/useKyc'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  User,
  CreditCard,
  AlertTriangle,
} from 'lucide-react'

const idTypeOptions = [
  { value: 'national_id', label: 'National ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: "Driver's License" },
]

const idTypeLabels: Record<string, string> = {
  national_id: 'National ID',
  passport: 'Passport',
  drivers_license: "Driver's License",
}

export default function KycVerification() {
  const { kyc, loading, submitKyc } = useKyc()
  const [fullName, setFullName] = useState('')
  const [idType, setIdType] = useState<'national_id' | 'passport' | 'drivers_license'>('national_id')
  const [idNumber, setIdNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !idNumber.trim()) {
      setError('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    const { error: submitError } = await submitKyc(fullName, idType, idNumber)

    if (submitError) {
      setError(submitError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    }
    setSubmitting(false)
  }

  const getStatusIcon = () => {
    if (!kyc) return <AlertTriangle className="text-slate-400" size={24} />
    switch (kyc.status) {
      case 'verified':
        return <CheckCircle className="text-emerald-400" size={24} />
      case 'under_review':
        return <Clock className="text-yellow-400" size={24} />
      case 'rejected':
        return <AlertCircle className="text-red-400" size={24} />
      default:
        return <AlertTriangle className="text-slate-400" size={24} />
    }
  }

  const getStatusColor = () => {
    if (!kyc) return 'bg-slate-500/20 border-slate-500/30'
    switch (kyc.status) {
      case 'verified':
        return 'bg-emerald-500/20 border-emerald-500/30'
      case 'under_review':
        return 'bg-yellow-500/20 border-yellow-500/30'
      case 'rejected':
        return 'bg-red-500/20 border-red-500/30'
      default:
        return 'bg-slate-500/20 border-slate-500/30'
    }
  }

  const getStatusLabel = () => {
    if (!kyc) return 'Not Submitted'
    switch (kyc.status) {
      case 'verified':
        return 'Verified'
      case 'under_review':
        return 'Under Review'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Not Submitted'
    }
  }

  const getStatusDescription = () => {
    if (!kyc) return 'Submit your identification documents for verification.'
    switch (kyc.status) {
      case 'verified':
        return 'Your identity has been successfully verified.'
      case 'under_review':
        return 'Your documents are being reviewed. This usually takes 1-3 business days.'
      case 'rejected':
        return kyc.rejection_reason || 'Your submission was rejected. Please resubmit with valid documents.'
      default:
        return 'Submit your identification documents for verification.'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Identity Verification (KYC)
        </h1>
        <p className="text-slate-400">
          Verify your identity to unlock full platform features and ensure account security.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border ${getStatusColor()}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${getStatusColor()}`}>
                  {getStatusIcon()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Verification Status: {getStatusLabel()}
                  </h3>
                  <p className="text-sm text-slate-400">{getStatusDescription()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {kyc?.status === 'verified' ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <ShieldCheck className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Verified Information</h2>
                    <p className="text-sm text-slate-400">Your identity has been confirmed</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-300 mb-1">
                    <User size={16} />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <p className="text-white">{kyc.full_name}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-300 mb-1">
                    <CreditCard size={16} />
                    <span className="text-sm font-medium">ID Type</span>
                  </div>
                  <p className="text-white">{idTypeLabels[kyc.id_type]}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-300 mb-1">
                    <FileText size={16} />
                    <span className="text-sm font-medium">ID Number</span>
                  </div>
                  <p className="text-white font-mono">
                    {kyc.id_number.slice(0, 4)}****{kyc.id_number.slice(-4)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-500/20 rounded-xl">
                    <ShieldCheck className="text-primary-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {kyc?.status === 'under_review' ? 'Submitted Information' : 'Submit Verification'}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {kyc?.status === 'under_review'
                        ? 'Your documents are being reviewed'
                        : 'Provide your identification details'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <CheckCircle size={20} />
                    <span>Your verification request has been submitted successfully!</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                {kyc?.status === 'under_review' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-300 mb-1">
                        <User size={16} />
                        <span className="text-sm font-medium">Full Name</span>
                      </div>
                      <p className="text-white">{kyc.full_name}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-300 mb-1">
                        <CreditCard size={16} />
                        <span className="text-sm font-medium">ID Type</span>
                      </div>
                      <p className="text-white">{idTypeLabels[kyc.id_type]}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-300 mb-1">
                        <FileText size={16} />
                        <span className="text-sm font-medium">ID Number</span>
                      </div>
                      <p className="text-white font-mono">{kyc.id_number}</p>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Clock size={18} />
                        <span className="font-medium">Review in Progress</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Your verification is being processed. You'll be notified once the review is complete.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Full Legal Name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name as it appears on your ID"
                      required
                    />

                    <Select
                      label="ID Document Type"
                      value={idType}
                      onChange={(e) => setIdType(e.target.value as typeof idType)}
                      options={idTypeOptions}
                    />

                    <Input
                      label="ID Number"
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Enter your ID document number"
                      required
                    />

                    <Button type="submit" fullWidth loading={submitting}>
                      <Upload size={20} />
                      Submit Verification
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">Why Verify?</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg mt-1">
                  <CheckCircle className="text-emerald-400" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Secure Withdrawals</p>
                  <p className="text-xs text-slate-400">Process withdrawals securely to verified accounts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg mt-1">
                  <CheckCircle className="text-emerald-400" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Account Protection</p>
                  <p className="text-xs text-slate-400">Enhanced security against unauthorized access</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg mt-1">
                  <CheckCircle className="text-emerald-400" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Regulatory Compliance</p>
                  <p className="text-xs text-slate-400">Meet regulatory requirements for investment platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <AlertCircle className="text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Review Time</h4>
                  <p className="text-sm text-slate-400">
                    Verification typically takes 1-3 business days. You'll receive a notification once your
                    documents have been reviewed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="text-yellow-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Important Notice</h4>
                  <p className="text-sm text-slate-400">
                    Please ensure all information matches your official ID document exactly.
                    Incorrect information may result in verification delays.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
