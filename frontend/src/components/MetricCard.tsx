import React from 'react'
import type { Sentiment } from '../types'

interface MetricCardProps {
  sentiment: Sentiment
  count: number
  total: number
  icon: React.ReactNode
}

const SENTIMENT_STYLES: Record<
  Sentiment,
  { border: string; bg: string; label: string; countColor: string; badgeBg: string; badgeText: string }
> = {
  positive: {
    border: 'border-t-emerald-500',
    bg: 'bg-emerald-500/10',
    label: 'Positive',
    countColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
  },
  negative: {
    border: 'border-t-rose-500',
    bg: 'bg-rose-500/10',
    label: 'Negative',
    countColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
  },
  neutral: {
    border: 'border-t-amber-500',
    bg: 'bg-amber-500/10',
    label: 'Neutral',
    countColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
  },
}

export default function MetricCard({ sentiment, count, total, icon }: MetricCardProps) {
  const styles = SENTIMENT_STYLES[sentiment]
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div
      className={`
        rounded-xl border border-slate-800 border-t-2 ${styles.border}
        bg-slate-900 p-6 shadow-lg shadow-slate-950/50 transition-all hover:border-slate-700
      `}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.bg}`}>
          {icon}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badgeBg} ${styles.badgeText}`}
        >
          {pct}%
        </span>
      </div>

      <p className="mb-1 text-sm font-medium text-slate-400">{styles.label}</p>
      <p className={`text-4xl font-bold tracking-tight ${styles.countColor}`}>
        {count.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-slate-600">
        {count.toLocaleString()} of {total.toLocaleString()} reviews
      </p>
    </div>
  )
}
