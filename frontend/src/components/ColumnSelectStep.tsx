import React, { useState } from 'react'
import { Columns, ArrowLeft, Sparkles, FileText } from 'lucide-react'

interface ColumnSelectStepProps {
  columns: string[]
  fileName: string
  rowCount: number
  onAnalyze: (column: string) => void
  onBack: () => void
}

export default function ColumnSelectStep({
  columns,
  fileName,
  rowCount,
  onAnalyze,
  onBack,
}: ColumnSelectStepProps) {
  const [selected, setSelected] = useState<string>(columns[0] ?? '')

  const textColumns = columns.filter((c) =>
    /review|text|comment|feedback|description|body|content/i.test(c),
  )
  const suggestedColumn = textColumns[0] ?? null

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
          <FileText className="h-4 w-4 text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{fileName}</p>
          <p className="text-xs text-slate-500">{rowCount.toLocaleString()} rows detected</p>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
          {columns.length} columns
        </span>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Columns className="h-4 w-4 text-indigo-400" />
          Select the review text column
        </div>
        <p className="text-sm text-slate-500">
          Choose which column contains the review text to analyze.
        </p>
      </div>

      <div className="mb-8 space-y-2">
        {columns.map((col) => {
          const isSuggested = col === suggestedColumn
          const isSelected = col === selected
          return (
            <button
              type="button"
              key={col}
              onClick={() => setSelected(col)}
              className={`
                group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all
                ${isSelected
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }
              `}
            >
              <div
                className={`
                  flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors
                  ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}
                `}
              >
                {isSelected && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>

              <span className="flex-1 truncate font-medium">{col}</span>

              {isSuggested && (
                <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                  <Sparkles className="h-3 w-3" />
                  Suggested
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={() => onAnalyze(selected)}
          disabled={!selected}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          Analyze {rowCount.toLocaleString()} Reviews
        </button>
      </div>
    </div>
  )
}
