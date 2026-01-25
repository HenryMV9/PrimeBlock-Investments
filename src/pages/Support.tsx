import { useState, useEffect, FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Card, { CardHeader, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Mail,
  Clock,
} from 'lucide-react'

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'account', label: 'Account Issue' },
  { value: 'withdrawal', label: 'Withdrawal Issue' },
  { value: 'deposit', label: 'Deposit Issue' },
]

interface LocationState {
  prefillSubject?: string
  prefillMessage?: string
}

export default function Support() {
  const location = useLocation()
  const { profile } = useAuth()
  const state = location.state as LocationState | null

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [subject, setSubject] = useState(state?.prefillSubject || 'general')
  const [message, setMessage] = useState(state?.prefillMessage || '')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      if (!fullName) setFullName(profile.full_name || '')
      if (!email) setEmail(profile.email || '')
    }
  }, [profile])

  useEffect(() => {
    if (state?.prefillSubject) {
      setSubject(state.prefillSubject)
    }
    if (state?.prefillMessage) {
      setMessage(state.prefillMessage)
    }
  }, [state])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitting(true)

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          subject,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccess(true)
      setFullName('')
      setEmail('')
      setSubject('general')
      setMessage('')
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Support & Contact
        </h1>
        <p className="text-slate-400">
          Get in touch with Prime Blocks Investments for support, complaints, or questions.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                  <MessageSquare className="text-primary-400" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Send Us a Message</h2>
                  <p className="text-sm text-slate-400">We'll get back to you as soon as possible</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <CheckCircle size={20} />
                  <span>Your message has been sent to our support team. We'll get back to you shortly.</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />

                <Select
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  options={subjectOptions}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or issue in detail"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                  />
                </div>

                <Button type="submit" fullWidth loading={submitting}>
                  <MessageSquare size={20} />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-white">Contact Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg mt-1">
                  <Mail className="text-primary-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Email Support</p>
                  <p className="text-sm text-slate-400 break-all">support@primeblockivestment.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg mt-1">
                  <Clock className="text-primary-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Business Hours</p>
                  <p className="text-sm text-slate-400">Monday - Friday</p>
                  <p className="text-sm text-slate-400">9:00 AM - 6:00 PM EST</p>
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
                  <h4 className="font-medium text-white mb-1">Response Time</h4>
                  <p className="text-sm text-slate-400">
                    We typically respond to all inquiries within 24-48 hours during business days.
                    For urgent matters, please mark your subject accordingly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <CheckCircle className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">What to Expect</h4>
                  <p className="text-sm text-slate-400">
                    Your message will be directly sent to our support team. We'll review your
                    inquiry and respond with the information or assistance you need.
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
