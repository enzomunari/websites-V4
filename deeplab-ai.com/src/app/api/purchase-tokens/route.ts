import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TOKENS_FILE = join(process.cwd(), 'data', 'purchase-tokens.json')

interface PurchaseToken {
  token: string
  userId: string
  credits: number
  createdAt: string
  used: boolean
  site: 'deeplab' | 'nudeet'
}

// Add CORS headers for cross-origin requests
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

function loadTokens(): Record<string, PurchaseToken> {
  try {
    if (!existsSync(TOKENS_FILE)) {
      console.log('📁 Token file does not exist, creating new one')
      return {}
    }
    
    const data = readFileSync(TOKENS_FILE, 'utf-8')
    console.log('📂 Raw token file content:', data.substring(0, 200) + '...')
    
    const parsed = JSON.parse(data)
    
    // Check if it's an array (corrupted format) and fix it
    if (Array.isArray(parsed)) {
      console.log('🔧 Detected array format, converting to object format')
      return {}
    }
    
    console.log('✅ Loaded tokens:', Object.keys(parsed).length)
    return parsed
  } catch (error) {
    console.error('❌ Error loading tokens:', error)
    return {}
  }
}

function saveTokens(tokens: Record<string, PurchaseToken>) {
  try {
    const data = JSON.stringify(tokens, null, 2)
    writeFileSync(TOKENS_FILE, data)
    console.log('💾 Tokens saved:', Object.keys(tokens).length)
  } catch (error) {
    console.error('❌ Error saving tokens:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, credits, site } = await request.json()
    
    if (!userId || !credits || !site) {
      return addCorsHeaders(NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      ))
    }

    const tokens = loadTokens()
    const token = `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newToken: PurchaseToken = {
      token,
      userId,
      credits,
      createdAt: new Date().toISOString(),
      used: false,
      site
    }
    
    tokens[token] = newToken
    saveTokens(tokens)
    
    console.log(`🎫 Generated token ${token} for ${site} user ${userId} (${credits} credits)`)
    console.log(`📅 Token created at: ${newToken.createdAt}`)
    
    return addCorsHeaders(NextResponse.json({ token }))
    
  } catch (error) {
    console.error('❌ Token creation error:', error)
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to create token' }, 
      { status: 500 }
    ))
  }
}