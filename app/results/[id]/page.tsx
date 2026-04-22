import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Improvement } from '@/lib/types'
import ResultsClient from './ResultsClient'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const audit = await prisma.audit.findUnique({ where: { id } })

  if (!audit || audit.status === 'error') {
    notFound()
  }

  const result = {
    overallScore: audit.overallScore ?? 0,
    url: audit.url,
    categories: [
      { label: 'Trust' as const, score: audit.trustScore ?? 0, description: 'Credibility signals & social proof' },
      { label: 'Messaging' as const, score: audit.messagingScore ?? 0, description: 'Copy clarity & value proposition' },
      { label: 'Conversion' as const, score: audit.conversionScore ?? 0, description: 'CTAs, forms & funnel clarity' },
      { label: 'UX' as const, score: audit.uxScore ?? 0, description: 'Navigation, flow & accessibility' },
      { label: 'Authority' as const, score: audit.authorityScore ?? 0, description: 'Brand credibility & expertise signals' },
    ],
    improvements: (audit.improvements as unknown as Improvement[]) ?? [],
    analyzedItems: audit.analyzedItems ?? [],
    insightText: audit.insightText ?? '',
  }

  return <ResultsClient result={result} />
}
