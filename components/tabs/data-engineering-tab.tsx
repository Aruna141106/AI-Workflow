"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Play, Loader2 } from "lucide-react"

const sampleData = [
  { id: 1, name: "John", age: 28, salary: 50000, department: "Engineering" },
  { id: 2, name: "Jane", age: null, salary: 60000, department: "Marketing" },
  { id: 3, name: "Bob", age: 35, salary: null, department: "Engineering" },
  { id: 4, name: "Alice", age: 42, salary: 75000, department: null },
  { id: 5, name: "John", age: 28, salary: 50000, department: "Engineering" },
]

const processedData = [
  { id: 1, name: "John", age: 0.0, salary: 0.0, department: 0 },
  { id: 2, name: "Jane", age: 0.35, salary: 0.4, department: 1 },
  { id: 3, name: "Bob", age: 0.7, salary: 0.5, department: 0 },
  { id: 4, name: "Alice", age: 1.0, salary: 1.0, department: 2 },
]

export function DataEngineeringTab() {
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string | null>(null)

  const steps = [
    { id: "missing", label: "Handle Missing Values", description: "Fill NaN with median/mode" },
    { id: "duplicates", label: "Remove Duplicates", description: "Drop duplicate rows" },
    { id: "encode", label: "Encode Categorical", description: "Label encode categories" },
    { id: "scale", label: "Scale Features", description: "Min-Max normalization" },
  ]

  const runPreprocessing = async () => {
    setProcessing(true)
    setCompleted([])

    for (const step of steps) {
      setCurrentStep(step.id)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCompleted((prev) => [...prev, step.id])
    }

    setCurrentStep(null)
    setProcessing(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Raw Data</CardTitle>
          <CardDescription>Sample dataset with missing values and duplicates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-muted-foreground">ID</th>
                  <th className="px-3 py-2 text-left text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground">Age</th>
                  <th className="px-3 py-2 text-left text-muted-foreground">Salary</th>
                  <th className="px-3 py-2 text-left text-muted-foreground">Dept</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="px-3 py-2 text-foreground">{row.id}</td>
                    <td className="px-3 py-2 text-foreground">{row.name}</td>
                    <td className="px-3 py-2">
                      {row.age === null ? (
                        <Badge variant="destructive" className="text-xs">
                          NaN
                        </Badge>
                      ) : (
                        <span className="text-foreground">{row.age}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {row.salary === null ? (
                        <Badge variant="destructive" className="text-xs">
                          NaN
                        </Badge>
                      ) : (
                        <span className="text-foreground">{row.salary}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {row.department === null ? (
                        <Badge variant="destructive" className="text-xs">
                          NaN
                        </Badge>
                      ) : (
                        <span className="text-foreground">{row.department}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">5 rows with missing values and 1 duplicate</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Preprocessing Pipeline</CardTitle>
          <CardDescription>Click to run the data cleaning steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                currentStep === step.id
                  ? "border-primary bg-primary/10"
                  : completed.includes(step.id)
                    ? "border-accent bg-accent/10"
                    : "border-border"
              }`}
            >
              <div>
                <p className="font-medium text-foreground">{step.label}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {currentStep === step.id ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : completed.includes(step.id) ? (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              ) : null}
            </div>
          ))}

          <Button onClick={runPreprocessing} disabled={processing} className="w-full">
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Preprocessing
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {completed.length === steps.length && (
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Processed Data</CardTitle>
            <CardDescription>Clean, encoded, and normalized dataset ready for ML</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left text-muted-foreground">ID</th>
                    <th className="px-3 py-2 text-left text-muted-foreground">Name</th>
                    <th className="px-3 py-2 text-left text-muted-foreground">Age (scaled)</th>
                    <th className="px-3 py-2 text-left text-muted-foreground">Salary (scaled)</th>
                    <th className="px-3 py-2 text-left text-muted-foreground">Dept (encoded)</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="px-3 py-2 text-foreground">{row.id}</td>
                      <td className="px-3 py-2 text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-accent">{row.age.toFixed(2)}</td>
                      <td className="px-3 py-2 text-accent">{row.salary.toFixed(2)}</td>
                      <td className="px-3 py-2 text-accent">{row.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">4 rows (1 duplicate removed)</Badge>
              <Badge variant="secondary">No missing values</Badge>
              <Badge variant="secondary">Features normalized 0-1</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
