import type { AnalyzeResponse, SummarizeGroups, SummarizeResponse } from './types'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body?.detail || body?.message || JSON.stringify(body)
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export async function analyzeReviews(
  reviews: string[],
  apiKey: string,
): Promise<AnalyzeResponse> {
  const res = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews, api_key: apiKey }),
  })
  return handleResponse<AnalyzeResponse>(res)
}

export async function summarizeReviews(
  groups: SummarizeGroups,
  apiKey: string,
): Promise<SummarizeResponse> {
  const res = await fetch('/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groups, api_key: apiKey }),
  })
  return handleResponse<SummarizeResponse>(res)
}
