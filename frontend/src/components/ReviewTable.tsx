import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AnalysisResult, Sentiment } from '../types'

interface ReviewTableProps {
  results: AnalysisResult[]
}

const BADGE_STYLES: Record<Sentiment, string> = {
  positive: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20',
  negative: 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/20',
  neutral: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20',
}

const SENTIMENT_LABELS: Record<Sentiment, string> = {
  positive: 'Positive',
  negative: 'Negative',
  neutral: 'Neutral',
}

const PAGE_SIZE = 10

export default function ReviewTable({ results }: ReviewTableProps) {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<Sentiment | 'all'>('all')

  const filtered = filter === 'all' ? results : results.filter((r) => r.sentiment === filter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageEnd = pageStart + PAGE_SIZE
  const pageRows = filtered.slice(pageStart, pageEnd)

  const handleFilter = (f: Sentiment | 'all') => {
    setFilter(f)
    setPage(1)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-slate-950/50">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Review Results
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            {filtered.length.toLocaleString()} reviews
            {filter !== 'all' ? ` (${filter})` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'positive', 'negative', 'neutral'] as const).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => handleFilter(f)}
              className={`
                rounded-full px-3 py-1 text-xs font-medium capitalize transition-all
                ${filter === f
                  ? f === 'all'
                    ? 'bg-slate-700 text-white'
                    : f === 'positive'
                      ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                      : f === 'negative'
                        ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                  : 'text-slate-500 hover:text-slate-300'
                }
              `}
            >
              {f === 'all' ? 'All' : SENTIMENT_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Review</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => {
              const globalIdx = pageStart + idx
              const isEven = idx % 2 === 0
              return (
                <tr
                  key={globalIdx}
                  className={`border-b border-slate-800/60 transition-colors last:border-0 hover:bg-slate-800/30 ${
                    isEven ? 'bg-slate-900' : 'bg-slate-800/20'
                  }`}
                >
                  <td className="px-6 py-4 text-xs text-slate-600">{globalIdx + 1}</td>
                  <td className="max-w-0 px-6 py-4">
                    <p className="truncate text-sm text-slate-300" title={row.review}>{row.review}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLES[row.sentiment]}`}>
                      {SENTIMENT_LABELS[row.sentiment]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-600">No reviews match this filter.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
          <p className="text-xs text-slate-500">
            Showing {pageStart + 1}–{Math.min(pageEnd, filtered.length)} of {filtered.length.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-all hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) pageNum = i + 1
              else if (currentPage <= 4) pageNum = i + 1
              else if (currentPage >= totalPages - 3) pageNum = totalPages - 6 + i
              else pageNum = currentPage - 3 + i
              return (
                <button type="button" key={pageNum} onClick={() => setPage(pageNum)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${ pageNum === currentPage ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white' }`}>
                  {pageNum}
                </button>
              )
            })}
            <button type="button" aria-label="Next page" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-all hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
