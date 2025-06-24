import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('🔔 Payhip webhook received!')
    console.log('📦 Payment data:', data)
    console.log('💡 Credits will be added when user visits success page')
    
    return NextResponse.json({ success: true, message: 'Webhook received' })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}