'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { refreshUserData, loadUnifiedUserData } from '@/utils/unifiedUserStorage'

export default function SuccessPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'already_processed'>('processing')
  const [message, setMessage] = useState('')
  const [credits, setCredits] = useState(0)
  const [showPage, setShowPage] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    processUserToken()
  }, [])

  const processUserToken = async () => {
    try {
      // Get current user data
      const userData = await loadUnifiedUserData()
      if (!userData) {
        setShowPage(true)
        setStatus('error')
        setMessage('User data not found')
        return
      }

      // Find and process user's pending token
      const response = await fetch('/api/purchase-tokens/process-user-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.userId })
      })

      const data = await response.json()

      if (response.ok) {
        setCredits(data.credits)
        
        // Refresh user data to show new credits
        await refreshUserData()
        
        // HANDLE REDIRECTS BY SITE - NO CROSS-CONTAMINATION
        if (data.site === 'nudeet') {
          console.log('🔄 Nudeet purchase - instant redirect to nudeet.com')
          // Instant redirect for Nudeet users - they never see Deeplab
          window.location.href = 'https://nudeet.com'
          return
        } else {
          console.log('✅ Deeplab purchase - showing Deeplab success page')
          // Show success page only for Deeplab users
          setStatus('success')
          setMessage(`Successfully added ${data.credits} credits!`)
          setShowPage(true)
          
          // Auto-redirect to Deeplab studio after 3 seconds
          setTimeout(() => {
            router.push('/studio')
          }, 3000)
        }
        
      } else {
        // Show error page for any site
        setShowPage(true)
        if (data.error === 'No pending token found') {
          setStatus('already_processed')
          setMessage('Your purchase has already been processed or no recent purchase found.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to process purchase')
        }
      }
    } catch (error) {
      // Show error page for any site
      setShowPage(true)
      setStatus('error')
      setMessage('Network error occurred')
      console.error('Token processing error:', error)
    }
  }

  // Only show spinner while processing - no branding visible
  if (!showPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
        
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-white mb-2">Processing Purchase</h1>
            <p className="text-white/80">Please wait while we add your credits...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-2">Purchase Successful!</h1>
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-green-300 text-lg font-semibold">+{credits} 💎 Credits Added!</p>
            </div>
            <p className="text-white/80 mb-4">{message}</p>
            <p className="text-white/60 text-sm">Redirecting to studio in 3 seconds...</p>
          </>
        )}

        {status === 'already_processed' && (
          <>
            <div className="text-6xl mb-4">ℹ️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Already Processed</h1>
            <p className="text-white/80 mb-4">{message}</p>
            <button 
              onClick={() => router.push('/studio')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Studio
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-red-300 mb-4">{message}</p>
            <button 
              onClick={() => router.push('/studio')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Studio
            </button>
          </>
        )}
      </div>
    </div>
  )
}