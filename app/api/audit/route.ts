import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { scrapeWebpage } from '@/lib/scrape'
import { runClaudeAudit } from '@/lib/claude'

const AuditSchema = z.object({
  url: z.string().url('Please enter a valid URL including https://'),
  businessType: z.string().min(1),
  mainGoal: z.string().min(1),
  audienceType: z.string().min(1),
  contexts: z.array(z.string()).default([]),
})

export async function POST(request: NextRequest) {
  // Parse and validate input
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = AuditSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  const input = parsed.data

  // Get Clerk user ID (null for guests)
  let dbUserId: string | null = null
  try {
    const { userId: clerkId } = await auth()
    if (clerkId) {
      const user = await prisma.user.upsert({
        where: { clerkId },
        update: {},
        create: { clerkId, email: `${clerkId}@placeholder.trustaudit` },
      })
      dbUserId = user.id
    }
  } catch {
    // Auth failure is non-fatal — guest audit continues
  }

  // Create pending audit record to get an ID immediately
  const audit = await prisma.audit.create({
    data: {
      url: input.url,
      businessType: input.businessType,
      mainGoal: input.mainGoal,
      audienceType: input.audienceType,
      contexts: input.contexts,
      status: 'pending',
      ...(dbUserId ? { userId: dbUserId } : {}),
    },
  })

  // Scrape the target URL
  let scrapedText: string
  try {
    scrapedText = await scrapeWebpage(input.url)
  } catch (err) {
    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        status: 'error',
        errorMessage: `Could not access ${input.url}. Please check the URL and try again.`,
      },
    })
    return Response.json(
      { error: `Could not access that URL. Make sure the site is publicly reachable.` },
      { status: 422 }
    )
  }

  // Run Claude AI analysis
  let result
  try {
    result = await runClaudeAudit(input, scrapedText)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Claude API error:', msg)
    await prisma.audit.update({
      where: { id: audit.id },
      data: { status: 'error', errorMessage: msg },
    })
    return Response.json({ error: `AI analysis failed: ${msg}` }, { status: 500 })
  }

  // Save results to database
  await prisma.audit.update({
    where: { id: audit.id },
    data: {
      status: 'complete',
      overallScore: result.overallScore,
      trustScore: result.categories.trust,
      messagingScore: result.categories.messaging,
      conversionScore: result.categories.conversion,
      uxScore: result.categories.ux,
      authorityScore: result.categories.authority,
      insightText: result.insightText,
      analyzedItems: result.analyzedItems,
      improvements: result.improvements as unknown as import('@prisma/client').Prisma.InputJsonValue,
    },
  })

  return Response.json({ id: audit.id })
}
