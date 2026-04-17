import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { AnalysisResult, SentimentCounts } from '../types'
import MetricCard from './MetricCard'
import SentimentChart from './SentimentChart'
import ReviewTable from './ReviewTable'
import SummaryCards from './SummaryCards'

interface DashboardProps {
  results: AnalysisResult[]
  summaries: { positive: string; negative: string } | null
  summaryLoading: boolean
}

function computeCounts(results: AnalysisResult[]): SentimentCounts {
  const counts = { positive: 0, negative: 0, neutral: 0, total: results.length }
  for (const r of results) {
    counts[r.sentiment]++
  }
  return counts
}

export default function Dashboard({ results, summaries, summaryLoading }: DashboardProps) {
  const counts = computeCounts(results)

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
        <p className="mt-1 text-sm text-slate-400">
          {counts.total.toLocaleString()} reviews analyzed
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          sentiment="positive"
          count={counts.positive}
          total={counts.total}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
        />
        <MetricCard
          sentiment="negative"
          count={counts.negative}
          total={counts.total}
          icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
        />
        <MetricCard
          sentiment="neutral"
          count={counts.neutral}
          total={counts.total}
          icon={<Minus className="h-5 w-5 text-amber-400" />}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <SentimentChart counts={counts} />
        <ReviewTable results={results} />
      </div>

      <SummaryCards summaries={summaries} loading={summaryLoading} />
    </div>
  )
}
