import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const audit = await prisma.audit.findUnique({ where: { id } })

  if (!audit) {
    return Response.json({ error: 'Audit not found' }, { status: 404 })
  }

  return Response.json(audit)
}
