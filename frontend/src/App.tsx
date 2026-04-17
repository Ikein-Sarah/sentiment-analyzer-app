import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { AnalysisResult, AppStep } from './types'
import { analyzeReviews, summarizeReviews } from './api'
import Header from './components/Header'
import UploadStep from './components/UploadStep'
import ColumnSelectStep from './components/ColumnSelectStep'
import Dashboard from './components/Dashboard'
import { AlertCircle, X } from 'lucide-react'

interface ParsedData {
  rows: Record<string, string>[]
  columns: string[]
  fileName: string
}

export default function App() {
  const [step, setStep] = useState<AppStep>('upload')
  const [apiKey, setApiKey] = useState('')
  const [parsed, setParsed] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [analyzeStatus, setAnalyzeStatus] = useState('')
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [results, setResults] = useState<AnalysisResult[]>([])
  const [summaries, setSummaries] = useState<{ positive: string; negative: string } | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const handleParsed = useCallback(
    (rows: Record<string, string>[], columns: string[], fileName: string) => {
      setParsed({ rows, columns, fileName })
      setStep('column-select')
    },
    [],
  )

  const startFakeProgress = useCallback((total: number) => {
    setAnalyzeProgress(0)
    let fakeCount = 0

    progressTimerRef.current = setInterval(() => {
      fakeCount += 1
      const displayed = Math.min(fakeCount, total)
      const pct = Math.min(95, Math.round((displayed / Math.max(total, 1)) * 100))
      setAnalyzeProgress(pct)
      setAnalyzeStatus(`Analyzing ${displayed} of ${total} reviews…`)
    }, Math.max(100, 1800 / Math.max(total, 1)))
  }, [])

  const stopFakeProgress = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    setAnalyzeProgress(100)
    setAnalyzeStatus('Analysis complete!')
  }, [])

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
  }, [])

  const handleAnalyze = useCallback(
    async (column: string) => {
      if (!parsed) return
      const reviews = parsed.rows
        .map((r) => (r[column] ?? '').trim())
        .filter(Boolean)

      if (reviews.length === 0) {
        setError('No non-empty rows found in the selected column.')
        setStep('column-select')
        return
      }

      setStep('analyzing')
      setError(null)
      startFakeProgress(reviews.length)

      try {
        const data = await analyzeReviews(reviews, apiKey)
        stopFakeProgress()

        await new Promise((r) => setTimeout(r, 600))

        setResults(data.results)
        setStep('results')

        const positive = data.results
          .filter((r) => r.sentiment === 'positive')
          .map((r) => r.review)
        const negative = data.results
          .filter((r) => r.sentiment === 'negative')
          .map((r) => r.review)

        if (positive.length > 0 || negative.length > 0) {
          setSummaryLoading(true)
          setSummaries(null)
          summarizeReviews({ positive, negative }, apiKey)
            .then((s) => setSummaries(s.summaries))
            .catch((err) => {
              setError(`Summary failed: ${err instanceof Error ? err.message : String(err)}`)
            })
            .finally(() => setSummaryLoading(false))
        }
      } catch (err) {
        stopFakeProgress()
        setError(err instanceof Error ? err.message : String(err))
        setStep('column-select')
      }
    },
    [parsed, apiKey, startFakeProgress, stopFakeProgress],
  )

  const handleStartOver = () => {
    setStep('upload')
    setParsed(null)
    setResults([])
    setSummaries(null)
    setSummaryLoading(false)
    setError(null)
    setAnalyzeProgress(0)
    setAnalyzeStatus('')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        showStartOver={step === 'results'}
        onStartOver={handleStartOver}
      />

      {error && step !== 'upload' && (
        <div className="sticky top-[65px] z-40 border-b border-rose-500/20 bg-rose-500/10 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span className="flex-1 text-sm text-rose-400">{error}</span>
            <button
              onClick={() => setError(null)}
              className="rounded-md p-1 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'upload' && (
        <UploadStep
          onParsed={handleParsed}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          error={error}
          onDismissError={() => setError(null)}
        />
      )}

      {step === 'column-select' && parsed && (
        <ColumnSelectStep
          columns={parsed.columns}
          fileName={parsed.fileName}
          rowCount={parsed.rows.length}
          onAnalyze={handleAnalyze}
          onBack={() => setStep('upload')}
        />
      )}

      {step === 'analyzing' && (
        <AnalyzingScreen
          progress={analyzeProgress}
          status={analyzeStatus}
        />
      )}

      {step === 'results' && (
        <Dashboard
          results={results}
          summaries={summaries}
          summaryLoading={summaryLoading}
        />
      )}
    </div>
  )
}

interface AnalyzingScreenProps {
  progress: number
  status: string
}

function AnalyzingScreen({ progress, status }: AnalyzingScreenProps) {
  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20">
          <svg
            className="h-10 w-10 animate-spin text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white">Analyzing Reviews</h2>
        <p className="mb-8 text-sm text-slate-400">
          Our AI is processing your reviews. This may take a moment.
        </p>

        <div className="overflow-hidden rounded-full bg-slate-800">
          <div
            className="progress-bar h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300"
            style={{ '--progress-width': `${progress}%` } as React.CSSProperties}
          />
        </div>

        <p className="mt-4 text-sm text-slate-400">{status}</p>
        <p className="mt-1 text-xs text-slate-600">{progress}% complete</p>
      </div>
    </div>
  )
}
