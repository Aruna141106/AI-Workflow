"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Brain, MessageSquare, Eye } from "lucide-react"
import { DataEngineeringTab } from "./tabs/data-engineering-tab"
import { MachineLearningTab } from "./tabs/machine-learning-tab"
import { NLPTab } from "./tabs/nlp-tab"
import { DeepLearningTab } from "./tabs/deep-learning-tab"

export function AIWorkflowDashboard() {
  const [activeTab, setActiveTab] = useState("data-engineering")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Workflow Demonstration</h1>
              <p className="text-sm text-muted-foreground">
                End-to-end AI development with pandas, scikit-learn, NLTK, and TensorFlow
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger
              value="data-engineering"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data Engineering</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger
              value="machine-learning"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Machine Learning</span>
              <span className="sm:hidden">ML</span>
            </TabsTrigger>
            <TabsTrigger
              value="nlp"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">NLP Sentiment</span>
              <span className="sm:hidden">NLP</span>
            </TabsTrigger>
            <TabsTrigger
              value="deep-learning"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Deep Learning</span>
              <span className="sm:hidden">DL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-engineering" className="mt-6">
            <DataEngineeringTab />
          </TabsContent>

          <TabsContent value="machine-learning" className="mt-6">
            <MachineLearningTab />
          </TabsContent>

          <TabsContent value="nlp" className="mt-6">
            <NLPTab />
          </TabsContent>

          <TabsContent value="deep-learning" className="mt-6">
            <DeepLearningTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
