import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { SentimentCounts } from '../types'

interface SentimentChartProps {
  counts: SentimentCounts
}

const COLORS = {
  positive: '#10b981',
  negative: '#f43f5e',
  neutral: '#f59e0b',
}

const LABELS = {
  positive: 'Positive',
  negative: 'Negative',
  neutral: 'Neutral',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { pct: number } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-slate-400">{item.name}</p>
      <p className="text-lg font-bold text-white">{item.value.toLocaleString()}</p>
      <p className="text-xs text-slate-500">{item.payload.pct}% of total</p>
    </div>
  )
}

function LegendItem({ name, value, pct, color }: { name: string; value: number; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-slate-400">{name}</span>
      <span className="ml-auto pl-4 text-sm font-semibold text-white">{value.toLocaleString()}</span>
      <span className="w-10 text-right text-xs text-slate-500">{pct}%</span>
    </div>
  )
}

export default function SentimentChart({ counts }: SentimentChartProps) {
  const { positive, negative, neutral, total } = counts

  const data = [
    { name: 'Positive', value: positive, pct: total > 0 ? Math.round((positive / total) * 100) : 0, key: 'positive' as const },
    { name: 'Negative', value: negative, pct: total > 0 ? Math.round((negative / total) * 100) : 0, key: 'negative' as const },
    { name: 'Neutral', value: neutral, pct: total > 0 ? Math.round((neutral / total) * 100) : 0, key: 'neutral' as const },
  ].filter((d) => d.value > 0)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/50">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400">Sentiment Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key]} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-2.5 border-t border-slate-800 pt-5">
        {(['positive', 'negative', 'neutral'] as const).map((key) => (
          <LegendItem key={key} name={LABELS[key]} value={counts[key]} pct={total > 0 ? Math.round((counts[key] / total) * 100) : 0} color={COLORS[key]} />
        ))}
      </div>
    </div>
  )
}
