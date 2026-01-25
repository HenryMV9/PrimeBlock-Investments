import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { PortfolioPerformance } from '../types'

export function usePortfolioPerformance() {
  const { user } = useAuth()
  const [performance, setPerformance] = useState<PortfolioPerformance[]>([])
  const [latestPerformance, setLatestPerformance] = useState<PortfolioPerformance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformance = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('portfolio_performance')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30)

    if (error) {
      setError(error.message)
    } else {
      setPerformance(data || [])
      setLatestPerformance(data?.[0] || null)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchPerformance()
  }, [fetchPerformance])

  return { performance, latestPerformance, loading, error, refetch: fetchPerformance }
}
