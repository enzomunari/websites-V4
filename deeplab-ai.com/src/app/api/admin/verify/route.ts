// src/app/api/admin/verify/route.ts - Admin password verification endpoint
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin password verification request received')
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    // Check Authorization header
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const providedPassword = authHeader.substring(7)
      
      if (providedPassword === adminPassword) {
        console.log('✅ Admin password verification successful')
        return NextResponse.json({ 
          success: true, 
          message: 'Authentication successful' 
        })
      }
    }
    
    // Also check request body for backward compatibility
    try {
      const body = await request.json()
      if (body.password === adminPassword) {
        console.log('✅ Admin password verification successful (via body)')
        return NextResponse.json({ 
          success: true, 
          message: 'Authentication successful' 
        })
      }
    } catch {
      // Body parsing failed, that's okay
    }
    
    console.log('❌ Admin password verification failed')
    return NextResponse.json(
      { success: false, message: 'Invalid password' }, 
      { status: 401 }
    )
    
  } catch (error) {
    console.error('❌ Admin verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Verification failed' }, 
      { status: 500 }
    )
  }
}