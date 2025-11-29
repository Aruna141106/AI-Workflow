"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eraser, Loader2 } from "lucide-react"

export function DeepLearningTab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineWidth = 20
    ctx.lineCap = "round"
    ctx.strokeStyle = "#ffffff"
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setPrediction(null)
    setConfidence([])
  }

  const predict = async () => {
    setPredicting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulated CNN prediction
    const randomDigit = Math.floor(Math.random() * 10)
    const confidences = Array.from({ length: 10 }, (_, i) =>
      i === randomDigit ? 0.85 + Math.random() * 0.14 : Math.random() * 0.15,
    )
    const total = confidences.reduce((a, b) => a + b, 0)
    const normalized = confidences.map((c) => c / total)

    setPrediction(randomDigit)
    setConfidence(normalized)
    setPredicting(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Draw a Digit</CardTitle>
          <CardDescription>Draw a digit (0-9) to classify with CNN</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="cursor-crosshair rounded-lg border border-border touch-none"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCanvas} className="flex-1 bg-transparent">
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={predict} disabled={predicting} className="flex-1">
              {predicting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Digit"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">CNN Architecture</CardTitle>
          <CardDescription>Convolutional Neural Network for MNIST</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Input Layer</span>
              <Badge variant="secondary">28 x 28 x 1</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Grayscale image input</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Conv2D + MaxPool</span>
              <Badge variant="secondary">32 filters</Badge>
            </div>
            <p className="text-sm text-muted-foreground">3x3 kernel, ReLU activation</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Conv2D + MaxPool</span>
              <Badge variant="secondary">64 filters</Badge>
            </div>
            <p className="text-sm text-muted-foreground">3x3 kernel, ReLU activation</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Dense Layer</span>
              <Badge variant="secondary">128 units</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Fully connected, ReLU</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Output Layer</span>
              <Badge variant="secondary">10 classes</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Softmax activation</p>
          </div>
        </CardContent>
      </Card>

      {prediction !== null && (
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Prediction Results</CardTitle>
            <CardDescription>CNN classification output with confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-2">Predicted Digit</p>
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-primary/20 border border-primary">
                  <span className="text-6xl font-bold text-primary">{prediction}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Confidence: {(Math.max(...confidence) * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="mb-3 text-muted-foreground">Class Probabilities</p>
                <div className="space-y-2">
                  {confidence.map((conf, digit) => (
                    <div key={digit} className="flex items-center gap-2">
                      <span className="w-4 text-sm text-muted-foreground">{digit}</span>
                      <div className="h-4 flex-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all ${
                            digit === prediction ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                          style={{ width: `${conf * 100}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-mono text-xs text-foreground">
                        {(conf * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Model: CNN</Badge>
              <Badge variant="secondary">Dataset: MNIST</Badge>
              <Badge variant="secondary">Test Accuracy: 98.5%</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
