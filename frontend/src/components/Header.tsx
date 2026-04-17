import React from 'react'
import { BarChart2 } from 'lucide-react'

interface HeaderProps {
  showStartOver?: boolean
  onStartOver?: () => void
}

export default function Header({ showStartOver, onStartOver }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <BarChart2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              SentimentAI
            </span>
            <span className="ml-2 hidden text-sm text-slate-400 sm:inline">
              Review Intelligence Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 sm:inline-block">
            Powered by AI
          </span>
          {showStartOver && (
            <button
              type="button"
              onClick={onStartOver}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
