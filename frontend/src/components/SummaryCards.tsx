import React from 'react'
import { ThumbsUp, AlertCircle } from 'lucide-react'

interface SummaryCardsProps {
  summaries: { positive: string; negative: string } | null
  loading: boolean
}

function SkeletonLines({ count }: { count: number }) {
  return (
    <div className="space-y-2.5 pt-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-3 rounded-full" style={{ width: `${100 - i * 8}%` }} />
      ))}
    </div>
  )
}

function SummaryCard({ variant, text, loading }: { variant: 'positive' | 'negative'; text: string | null; loading: boolean }) {
  const isPositive = variant === 'positive'
  return (
    <div className={`rounded-xl border bg-slate-900 p-6 shadow-lg shadow-slate-950/50 transition-all ${ isPositive ? 'border-emerald-600/30 hover:border-emerald-600/50' : 'border-rose-600/30 hover:border-rose-600/50' }`}>
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ isPositive ? 'bg-emerald-500/15' : 'bg-rose-500/15' }`}>
          {isPositive ? <ThumbsUp className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
        </div>
        <div>
          <p className={`text-sm font-semibold ${ isPositive ? 'text-emerald-400' : 'text-rose-400' }`}>
            {isPositive ? 'What Customers Love' : 'Main Complaints'}
          </p>
          <p className="text-xs text-slate-600">{isPositive ? 'Positive sentiment themes' : 'Negative sentiment themes'}</p>
        </div>
      </div>
      <div className="min-h-[80px]">
        {loading ? <SkeletonLines count={4} /> : text ? <p className="text-sm leading-relaxed text-slate-300">{text}</p> : <p className="text-sm italic text-slate-600">No summary available.</p>}
      </div>
    </div>
  )
}

export default function SummaryCards({ summaries, loading }: SummaryCardsProps) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">AI Summaries</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SummaryCard variant="positive" text={summaries?.positive ?? null} loading={loading} />
        <SummaryCard variant="negative" text={summaries?.negative ?? null} loading={loading} />
      </div>
    </div>
  )
}
