interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
