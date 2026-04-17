import React, { useCallback, useRef, useState } from 'react'
import Papa from 'papaparse'
import { Upload, Key, FileText, AlertCircle, ArrowRight } from 'lucide-react'

interface UploadStepProps {
  onParsed: (rows: Record<string, string>[], columns: string[], fileName: string) => void
  apiKey: string
  onApiKeyChange: (key: string) => void
  error: string | null
  onDismissError: () => void
}

export default function UploadStep({
  onParsed,
  apiKey,
  onApiKeyChange,
  error,
  onDismissError,
}: UploadStepProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv')) {
        setParseError('Please upload a CSV file.')
        return
      }
      setParseError(null)
      setFileName(file.name)

      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          const columns = results.meta.fields ?? []
          if (columns.length === 0) {
            setParseError('Could not detect columns in this CSV file.')
            return
          }
          onParsed(results.data, columns, file.name)
        },
        error(err) {
          setParseError(err.message)
        },
      })
    },
    [onParsed],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) parseFile(file)
    },
    [parseFile],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  const canContinue = !!fileName && !!apiKey.trim() && !parseError

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      {(error || parseError) && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1">{error ?? parseError}</span>
          <button
            type="button"
            onClick={() => {
              onDismissError()
              setParseError(null)
            }}
            className="ml-auto shrink-0 text-rose-400 hover:text-rose-300"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
          Analyze Customer Reviews
        </h1>
        <p className="text-slate-400">
          Upload a CSV of reviews and get instant AI-powered sentiment
          breakdowns, charts, and summaries.
        </p>
      </div>

      <div className="mb-6">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Key className="h-4 w-4 text-indigo-400" />
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-••••••••••••••••••••••••"
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Your key is never stored — it's sent directly to the analysis API.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        aria-label="Upload CSV file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed
          px-8 py-14 text-center transition-all cursor-pointer
          ${dragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : fileName
              ? 'border-emerald-600/60 bg-emerald-500/5'
              : 'border-slate-700 bg-slate-900 hover:border-indigo-600/60 hover:bg-slate-900/60'
          }
        `}
      >
        {fileName ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <FileText className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-emerald-400">{fileName}</p>
              <p className="mt-1 text-sm text-slate-400">
                File loaded — click to replace
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700">
              <Upload className="h-7 w-7 text-slate-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                Drop your CSV here
              </p>
              <p className="mt-1 text-sm text-slate-400">
                or{' '}
                <span className="text-indigo-400 underline underline-offset-2">
                  click to browse
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-600">Accepts .csv files only</p>
          </>
        )}
      </div>

      {canContinue && (
        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400">
          <ArrowRight className="h-4 w-4 text-indigo-400" />
          File loaded. Select your review column on the next step.
        </p>
      )}
    </div>
  )
}
