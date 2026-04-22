import type { AuditFormInput, ClaudeAuditResponse } from './types'

function buildPrompt(input: AuditFormInput, scrapedText: string): string {
  return `You are an expert website conversion and trust analyst. Analyze the following website content and provide a structured audit.

WEBSITE URL: ${input.url}
BUSINESS TYPE: ${input.businessType}
MAIN GOAL: ${input.mainGoal}
TARGET AUDIENCE: ${input.audienceType}
USER CONTEXT: ${input.contexts.join(', ') || 'None specified'}

WEBSITE CONTENT:
${scrapedText}

Evaluate the website across these 5 categories, each scored 0–100:

1. TRUST (0–100): Security indicators, social proof (testimonials, reviews, logos), privacy policy, contact information, professional design, HTTPS.
2. MESSAGING (0–100): Headline clarity, value proposition strength, benefit-focused copy, clarity of what the business does within 5 seconds, tone matching the audience.
3. CONVERSION (0–100): Call-to-action visibility and clarity, placement above the fold, number of CTAs, form simplicity, friction in the purchase/contact flow.
4. UX (0–100): Navigation clarity, mobile-friendliness signals, logical information hierarchy, accessibility considerations.
5. AUTHORITY (0–100): Expert positioning, credentials, case studies, media mentions, years of experience, awards, certifications, notable clients.

Return ONLY valid JSON with no markdown, no code blocks, no explanation. Use exactly this structure:

{
  "overallScore": <weighted average: Trust 25%, Messaging 20%, Conversion 25%, UX 15%, Authority 15%>,
  "categories": {
    "trust": <0-100>,
    "messaging": <0-100>,
    "conversion": <0-100>,
    "ux": <0-100>,
    "authority": <0-100>
  },
  "improvements": [
    { "title": "<actionable title, max 10 words>", "detail": "<1-2 sentence explanation>", "priority": "High" },
    { "title": "<actionable title, max 10 words>", "detail": "<1-2 sentence explanation>", "priority": "High" },
    { "title": "<actionable title, max 10 words>", "detail": "<1-2 sentence explanation>", "priority": "Medium" }
  ],
  "analyzedItems": [
    "<specific thing analyzed>",
    "<specific thing analyzed>",
    "<specific thing analyzed>",
    "<specific thing analyzed>",
    "<specific thing analyzed>"
  ],
  "insightText": "<2-3 sentences. Be direct and specific. Mention the biggest strength and the most impactful opportunity. Write as if speaking to the business owner.>"
}`
}

const MODELS = [
  'google/gemma-3-27b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
]

export async function runClaudeAudit(
  input: AuditFormInput,
  scrapedText: string
): Promise<ClaudeAuditResponse> {
  const prompt = buildPrompt(input, scrapedText)

  for (const model of MODELS) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://trustaudit.ai',
        'X-Title': 'TrustAudit AI',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    })

    if (response.status === 429 || response.status === 404) continue

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenRouter error ${response.status}: ${err}`)
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[]
    }

    const text = data.choices[0]?.message?.content?.trim() ?? ''
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(json) as ClaudeAuditResponse

    const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))
    parsed.overallScore = clamp(parsed.overallScore)
    parsed.categories.trust = clamp(parsed.categories.trust)
    parsed.categories.messaging = clamp(parsed.categories.messaging)
    parsed.categories.conversion = clamp(parsed.categories.conversion)
    parsed.categories.ux = clamp(parsed.categories.ux)
    parsed.categories.authority = clamp(parsed.categories.authority)

    return parsed
  }

  throw new Error('All free AI models are currently busy. Please try again in a moment.')
}
