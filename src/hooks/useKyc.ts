import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { KycVerification } from '../types'

export function useKyc() {
  const { user } = useAuth()
  const [kyc, setKyc] = useState<KycVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKyc = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      setError(error.message)
    } else {
      setKyc(data)
    }
    setLoading(false)
  }

  const submitKyc = async (
    fullName: string,
    idType: 'national_id' | 'passport' | 'drivers_license',
    idNumber: string,
    idImageUrl?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('kyc_verifications')
      .upsert({
        user_id: user.id,
        full_name: fullName,
        id_type: idType,
        id_number: idNumber,
        id_image_url: idImageUrl || null,
        status: 'under_review',
        submitted_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .maybeSingle()

    if (!error) {
      await fetchKyc()
    }

    return { data, error }
  }

  useEffect(() => {
    fetchKyc()
  }, [user?.id])

  return { kyc, loading, error, submitKyc, refetch: fetchKyc }
}
