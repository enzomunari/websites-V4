import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { addUserCredits } from '@/utils/sharedDataStorage'

const TOKENS_FILE = join(process.cwd(), 'data', 'purchase-tokens.json')

interface PurchaseToken {
  token: string
  userId: string
  credits: number
  createdAt: string
  used: boolean
  site: 'deeplab' | 'nudeet'
}

function loadTokens(): Record<string, PurchaseToken> {
  try {
    if (!existsSync(TOKENS_FILE)) {
      return {}
    }
    
    const data = readFileSync(TOKENS_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    
    if (Array.isArray(parsed)) {
      return {}
    }
    
    return parsed
  } catch (error) {
    console.error('❌ Error loading tokens:', error)
    return {}
  }
}

function saveTokens(tokens: Record<string, PurchaseToken>) {
  try {
    writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2))
  } catch (error) {
    console.error('❌ Error saving tokens:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const tokens = loadTokens()
    console.log(`🔍 Looking for pending token for user: ${userId}`)
    
    // Find the most recent unused token for this user
    let foundToken = null
    let foundTokenId = null
    
    for (const [tokenId, token] of Object.entries(tokens)) {
      if (token.userId === userId && !token.used) {
        // Check if token is not expired (30 minutes)
        const createdAt = new Date(token.createdAt)
        const now = new Date()
        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)
        
        console.log(`🎫 Found token ${tokenId}: ${token.credits} credits, ${diffMinutes.toFixed(1)}min old`)
        
        if (diffMinutes <= 30) {
          if (!foundToken || new Date(token.createdAt) > new Date(foundToken.createdAt)) {
            foundToken = token
            foundTokenId = tokenId
          }
        } else {
          console.log(`⏰ Token ${tokenId} expired (${diffMinutes.toFixed(1)} minutes old)`)
        }
      }
    }
    
    if (!foundToken || !foundTokenId) {
      console.log(`❌ No pending token found for user ${userId}`)
      return NextResponse.json({ error: 'No pending token found' }, { status: 404 })
    }
    
    console.log(`🎫 Processing token ${foundTokenId} for user ${userId}`)
    
    // Add credits to user
    const success = await addUserCredits(foundToken.userId, foundToken.credits)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
    }
    
    // Mark token as used
    foundToken.used = true
    tokens[foundTokenId] = foundToken
    saveTokens(tokens)
    
    console.log(`✅ Credits added: ${foundToken.credits} to user ${foundToken.userId} via token ${foundTokenId}`)
    
    return NextResponse.json({
      success: true,
      credits: foundToken.credits,
      userId: foundToken.userId,
      site: foundToken.site
    })
    
  } catch (error) {
    console.error('❌ User token processing error:', error)
    return NextResponse.json({ 
      error: 'Failed to process token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}