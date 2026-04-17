export type Sentiment = 'positive' | 'negative' | 'neutral'

export interface AnalysisResult {
  review: string
  sentiment: Sentiment
}

export interface AnalyzeResponse {
  results: AnalysisResult[]
}

export interface SummarizeGroups {
  positive: string[]
  negative: string[]
}

export interface SummarizeResponse {
  summaries: {
    positive: string
    negative: string
  }
}

export interface SentimentCounts {
  positive: number
  negative: number
  neutral: number
  total: number
}

export type AppStep = 'upload' | 'column-select' | 'analyzing' | 'results'
