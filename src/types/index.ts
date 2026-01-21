export interface User {
  id: string
  email: string
  full_name: string
  balance: number
  total_deposits: number
  total_withdrawals: number
  total_profits: number
  is_admin: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'profit_credit' | 'balance_adjustment'
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  description: string
  created_at: string
  processed_at: string | null
  processed_by: string | null
}

export interface PortfolioPerformance {
  id: string
  user_id: string
  date: string
  portfolio_value: number
  daily_change: number
  daily_change_percent: number
  total_roi: number
  total_roi_percent: number
}

export interface DepositRequest {
  id: string
  user_id: string
  amount: number
  payment_method: string
  status: 'pending' | 'approved' | 'rejected'
  reference_number: string
  notes: string
  created_at: string
  processed_at: string | null
  processed_by: string | null
}

export interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  withdrawal_method: string
  account_details: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string
  created_at: string
  processed_at: string | null
  processed_by: string | null
}
