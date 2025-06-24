import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const TOKENS_FILE = join(process.cwd(), 'data', 'purchase-tokens.json')

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    const tokens = JSON.parse(readFileSync(TOKENS_FILE, 'utf8'))
    const updatedTokens = tokens.map((t: any) => 
      t.token === token ? { ...t, status: 'credited', creditedAt: Date.now() } : t
    )
    
    writeFileSync(TOKENS_FILE, JSON.stringify(updatedTokens, null, 2))
    
    console.log(`🎫 Marked token ${token} as used`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error marking token as used:', error)
    return NextResponse.json({ error: 'Failed to mark token' }, { status: 500 })
  }
}