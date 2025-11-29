"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, ThumbsUp, ThumbsDown, Minus } from "lucide-react"

type Sentiment = "positive" | "negative" | "neutral" | null

interface AnalysisResult {
  text: string
  sentiment: Sentiment
  scores: { positive: number; neutral: number; negative: number; compound: number }
  tokens: string[]
}

const sampleTexts = [
  "I absolutely love this product! It exceeded all my expectations.",
  "This is the worst experience I've ever had. Completely disappointed.",
  "The weather today is cloudy with a chance of rain.",
]

export function NLPTab() {
  const [text, setText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeSentiment = async () => {
    if (!text.trim()) return

    setAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulated VADER-like sentiment analysis
    const lowerText = text.toLowerCase()
    const positiveWords = [
      "love",
      "great",
      "amazing",
      "excellent",
      "best",
      "wonderful",
      "fantastic",
      "exceeded",
      "happy",
    ]
    const negativeWords = ["hate", "worst", "terrible", "bad", "awful", "disappointed", "horrible", "poor", "angry"]

    let posScore = 0
    let negScore = 0

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) posScore += 0.2
    })
    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) negScore += 0.2
    })

    const compound = Math.min(1, Math.max(-1, posScore - negScore))
    const total = posScore + negScore + 0.1
    const positive = posScore / total
    const negative = negScore / total
    const neutral = 0.1 / total

    let sentiment: Sentiment = "neutral"
    if (compound >= 0.05) sentiment = "positive"
    else if (compound <= -0.05) sentiment = "negative"

    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)

    setResult({
      text,
      sentiment,
      scores: {
        positive: Math.min(positive, 0.99),
        neutral: neutral,
        negative: Math.min(negative, 0.99),
        compound,
      },
      tokens,
    })
    setAnalyzing(false)
  }

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-5 w-5 text-accent" />
      case "negative":
        return <ThumbsDown className="h-5 w-5 text-destructive" />
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-accent/20 text-accent border-accent"
      case "negative":
        return "bg-destructive/20 text-destructive border-destructive"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Sentiment Analysis</CardTitle>
          <CardDescription>Enter text to analyze using VADER lexicon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] bg-secondary/30"
          />

          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, idx) => (
              <Button key={idx} variant="outline" size="sm" onClick={() => setText(sample)} className="text-xs">
                Sample {idx + 1}
              </Button>
            ))}
          </div>

          <Button onClick={analyzeSentiment} disabled={analyzing || !text.trim()} className="w-full">
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Sentiment"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">NLTK Pipeline</CardTitle>
          <CardDescription>Processing steps for sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border p-3">
            <p className="font-medium text-foreground">1. Text Cleaning</p>
            <p className="text-sm text-muted-foreground">Remove special characters and normalize case</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="font-medium text-foreground">2. Tokenization</p>
            <p className="text-sm text-muted-foreground">Split text into individual words/tokens</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="font-medium text-foreground">3. VADER Scoring</p>
            <p className="text-sm text-muted-foreground">Calculate polarity scores using lexicon</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="font-medium text-foreground">4. Classification</p>
            <p className="text-sm text-muted-foreground">Label as positive, neutral, or negative</p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Analysis Results</CardTitle>
            <CardDescription>VADER sentiment analysis output</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${getSentimentColor(result.sentiment)}`}
              >
                {getSentimentIcon(result.sentiment)}
                <span className="font-medium capitalize">{result.sentiment}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Compound Score:{" "}
                <span className="font-mono font-medium text-foreground">{result.scores.compound.toFixed(3)}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-foreground">Polarity Scores</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-sm text-muted-foreground">Positive:</span>
                    <div className="h-2 flex-1 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${result.scores.positive * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-sm text-foreground">
                      {result.scores.positive.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-sm text-muted-foreground">Neutral:</span>
                    <div className="h-2 flex-1 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-muted-foreground"
                        style={{ width: `${result.scores.neutral * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-sm text-foreground">
                      {result.scores.neutral.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-sm text-muted-foreground">Negative:</span>
                    <div className="h-2 flex-1 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-destructive"
                        style={{ width: `${result.scores.negative * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-sm text-foreground">
                      {result.scores.negative.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-foreground">Tokens</h4>
                <div className="flex flex-wrap gap-1">
                  {result.tokens.map((token, idx) => (
                    <Badge key={idx} variant="secondary" className="font-mono text-xs">
                      {token}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
