import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { DepositRequest } from '../types'

export function useDepositRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<DepositRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('deposit_requests')
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

  const createRequest = async (amount: number, paymentMethod: string, referenceNumber: string, notes: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('deposit_requests')
      .insert({
        user_id: user.id,
        amount,
        payment_method: paymentMethod,
        reference_number: referenceNumber,
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
