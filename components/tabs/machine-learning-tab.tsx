"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Loader2 } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const confusionMatrix = {
  decisionTree: [
    [45, 5],
    [8, 42],
  ],
  logisticRegression: [
    [47, 3],
    [6, 44],
  ],
}

const metrics = {
  decisionTree: { accuracy: 0.87, precision: 0.89, recall: 0.84, f1: 0.86 },
  logisticRegression: { accuracy: 0.91, precision: 0.94, recall: 0.88, f1: 0.91 },
}

export function MachineLearningTab() {
  const [model, setModel] = useState<"decisionTree" | "logisticRegression">("decisionTree")
  const [training, setTraining] = useState(false)
  const [trained, setTrained] = useState(false)

  const trainModel = async () => {
    setTraining(true)
    setTrained(false)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTrained(true)
    setTraining(false)
  }

  const currentMetrics = metrics[model]
  const currentMatrix = confusionMatrix[model]

  const chartData = [
    { metric: "Accuracy", value: currentMetrics.accuracy },
    { metric: "Precision", value: currentMetrics.precision },
    { metric: "Recall", value: currentMetrics.recall },
    { metric: "F1 Score", value: currentMetrics.f1 },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Model Selection</CardTitle>
          <CardDescription>Choose a classification algorithm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={model}
            onValueChange={(v) => {
              setModel(v as typeof model)
              setTrained(false)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decisionTree">Decision Tree Classifier</SelectItem>
              <SelectItem value="logisticRegression">Logistic Regression</SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="font-medium text-foreground mb-2">
              {model === "decisionTree" ? "Decision Tree" : "Logistic Regression"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {model === "decisionTree"
                ? "A tree-based model that makes decisions by splitting data based on feature thresholds. Interpretable and handles non-linear relationships."
                : "A linear model that estimates probabilities using the logistic function. Fast, interpretable, and works well for linearly separable data."}
            </p>
          </div>

          <Button onClick={trainModel} disabled={training} className="w-full">
            {training ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training Model...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Train Model
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {trained && (
        <>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Confusion Matrix</CardTitle>
              <CardDescription>True vs Predicted classifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-1 text-center text-sm">
                <div></div>
                <div className="text-muted-foreground py-2">Pred: 0</div>
                <div className="text-muted-foreground py-2">Pred: 1</div>
                <div className="text-muted-foreground py-2">True: 0</div>
                <div className="rounded bg-accent/20 p-4 text-xl font-bold text-accent">{currentMatrix[0][0]}</div>
                <div className="rounded bg-destructive/20 p-4 text-xl font-bold text-destructive">
                  {currentMatrix[0][1]}
                </div>
                <div className="text-muted-foreground py-2">True: 1</div>
                <div className="rounded bg-destructive/20 p-4 text-xl font-bold text-destructive">
                  {currentMatrix[1][0]}
                </div>
                <div className="rounded bg-accent/20 p-4 text-xl font-bold text-accent">{currentMatrix[1][1]}</div>
              </div>
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-accent/20"></span> Correct
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-destructive/20"></span> Errors
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Metrics</CardTitle>
              <CardDescription>Classification report visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <ChartContainer
                  config={{
                    value: { label: "Score", color: "var(--chart-1)" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <YAxis type="category" dataKey="metric" width={70} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={4}>
                        {chartData.map((_, index) => (
                          <Cell key={index} fill={`var(--chart-${(index % 4) + 1})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-muted-foreground">Accuracy</span>
                    <Badge variant="secondary">{(currentMetrics.accuracy * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-muted-foreground">Precision</span>
                    <Badge variant="secondary">{(currentMetrics.precision * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-muted-foreground">Recall</span>
                    <Badge variant="secondary">{(currentMetrics.recall * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-muted-foreground">F1 Score</span>
                    <Badge variant="secondary">{(currentMetrics.f1 * 100).toFixed(1)}%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
