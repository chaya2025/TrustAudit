export interface AuditFormInput {
  url: string
  businessType: string
  mainGoal: string
  audienceType: string
  contexts: string[]
}

export interface Improvement {
  title: string
  detail: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface CategoryScore {
  label: 'Trust' | 'Messaging' | 'Conversion' | 'UX' | 'Authority'
  score: number
  description: string
}

export interface AuditResult {
  id: string
  url: string
  overallScore: number
  categories: CategoryScore[]
  improvements: Improvement[]
  analyzedItems: string[]
  insightText: string
  createdAt: string
}

export interface ClaudeAuditResponse {
  overallScore: number
  categories: {
    trust: number
    messaging: number
    conversion: number
    ux: number
    authority: number
  }
  improvements: Improvement[]
  analyzedItems: string[]
  insightText: string
}
