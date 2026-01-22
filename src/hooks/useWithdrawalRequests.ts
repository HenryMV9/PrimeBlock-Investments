import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { WithdrawalRequest } from '../types'

export function useWithdrawalRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  const createRequest = async (amount: number, withdrawalMethod: string, accountDetails: string, notes: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        amount,
        withdrawal_method: withdrawalMethod,
        account_details: accountDetails,
        notes,
      })

    if (!error) {
      await fetchRequests()
    }

    return { error }
  }

  useEffect(() => {
    fetchRequests()
  }, [user?.id])

  return { requests, loading, error, createRequest, refetch: fetchRequests }
}
