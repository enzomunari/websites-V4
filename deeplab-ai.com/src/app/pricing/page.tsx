'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Sparkles, 
  Star, 
  Check, 
  Zap, 
  Shield,
  Camera,
  Users,
  Award,
  Crown
} from 'lucide-react'
import { 
  loadUnifiedUserData,
  refreshUserData,
  canUseFreeTrial,
  markFreeTrialUsed
} from '../../utils/unifiedUserStorage'

// Enhanced localStorage with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn(`localStorage.getItem failed for key ${key}:`, error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn(`localStorage.setItem failed for key ${key}:`, error)
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`localStorage.removeItem failed for key ${key}:`, error)
    }
  }
}

interface UserData {
  userId: string;
  deviceId: string;
  credits: number;
  lastFreeTrialDate: string | null;
  firstVisitDate: string;
  lastVisitDate: string;
  totalGenerations: number;
  totalFreeTrialsUsed: number;
  isBlocked: boolean;
  sitesUsed: string[];
  lastSyncDate: string;
}

const PricingPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)

  // 🔧 FIXED: Get user data using unified system
  const getUserData = async (): Promise<UserData | null> => {
    if (typeof window === 'undefined') return null
    
    console.log('📋 Force loading fresh unified user data for Deeplab...')
    
    try {
      const userData = await refreshUserData()
      
      safeLocalStorage.setItem('shared_user_id', userData.userId)
      safeLocalStorage.setItem('shared_device_id', userData.deviceId)
      safeLocalStorage.setItem('shared_credits', userData.credits.toString())
      safeLocalStorage.setItem('shared_total_generations', userData.totalGenerations.toString())
      safeLocalStorage.setItem('shared_free_trials_used', userData.totalFreeTrialsUsed.toString())
      
      console.log('✅ Fresh unified user data loaded:', userData.userId, `Credits: ${userData.credits}`)
      
      return userData
    } catch (error) {
      console.error('Error loading unified user data:', error)
      return null
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      console.log('🔄 Loading user data on pricing page mount...')
      const data = await getUserData()
      setUserData(data)
      
      if (data) {
        console.log('👤 Pricing page loaded user:', data.userId, 'Credits:', data.credits)
      }
    }
    
    loadUserData()
  }, [])

  // 🔧 FIXED: handleBuyCreditsFixed with popup-first approach
  const handleBuyCreditsFixed = async (credits: number, productId: string, payhipProductCode: string) => {
    if (!userData) return
    
    try {
      console.log(`🎫 Generating purchase token for ${credits} credits...`)
      
      // ⚡ CRITICAL FIX: Store the window reference BEFORE any async operations
      const popup = window.open('', '_blank')
      if (!popup) {
        alert('Please allow popups for this site to complete your purchase')
        return
      }
      
      // Show loading in the popup window
      popup.document.write(`
        <html>
          <head><title>Processing Payment...</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>🔄 Setting up your payment...</h2>
            <p>Please wait while we redirect you to the secure payment page.</p>
          </body>
        </html>
      `)
      
      const response = await fetch('/api/purchase-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.userId,
          deviceId: userData.deviceId,
          credits: credits,
          productId: productId,
          site: 'deeplab'
        })
      })
      
      if (!response.ok) {
        popup.close()
        throw new Error('Failed to create purchase token')
      }
      
      const { token } = await response.json()
      console.log(`✅ Token generated: ${token}`)
      
      const returnUrl = `https://deeplab-ai.com/studio/success?token=${token}`
      const payhipUrl = `https://payhip.com/b/${payhipProductCode}?return_url=${encodeURIComponent(returnUrl)}`
      
      // Redirect the already-opened popup
      popup.location.href = payhipUrl
      console.log('🔗 Payhip URL:', payhipUrl)
      
    } catch (error) {
      console.error('❌ Failed to initiate purchase:', error)
      alert('Failed to initiate purchase. Please try again.')
    }
  }

  const plans = [
    {
      name: 'Starter Pack',
      price: '$3.99',
      credits: 3,
      description: 'Perfect to try it out',
      features: [
        '3 AI headshots',
        'All environments & styles',
        'High-resolution downloads',
        'Instant generation'
      ],
      popular: false
    },
    {
      name: 'Popular Pack',
      price: '$8.99',
      credits: 10,
      description: 'Great value for money',
      features: [
        '10 AI headshots',
        'All environments & styles',
        'High-resolution downloads',
        'Priority processing',
        'Multiple variations'
      ],
      popular: true
    },
    {
      name: 'Pro Pack',
      price: '$10.99',
      credits: 15,
      description: 'Best value pack',
      features: [
        '15 AI headshots',
        'All environments & styles',
        'High-resolution downloads',
        'Priority processing',
        'Multiple variations',
        'Premium support'
      ],
      popular: false
    }
  ]

  const allFeatures = [
    {
      icon: <Shield style={{ width: '24px', height: '24px' }} />,
      title: 'Secure & Private',
      description: 'Your photos are processed securely and deleted after generation'
    },
    {
      icon: <Zap style={{ width: '24px', height: '24px' }} />,
      title: '30-second Generation',
      description: 'Get professional headshots in under 30 seconds'
    },
    {
      icon: <Sparkles style={{ width: '24px', height: '24px' }} />,
      title: 'Professional Quality',
      description: 'Studio-quality results perfect for LinkedIn and business use'
    },
    {
      icon: <Camera style={{ width: '24px', height: '24px' }} />,
      title: 'HD Downloads',
      description: 'High-resolution images suitable for professional use and printing'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
     <header style={{ 
  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
  borderBottom: '1px solid #f3f4f6', 
  position: 'sticky', 
  top: 0, 
  zIndex: 40, 
  backdropFilter: 'blur(16px)'
}}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
            <Link href="/" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              textDecoration: 'none',
              color: 'inherit'
            }}>
              <ArrowLeft style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}>
                <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Deeplab-ai</h1>
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Pricing</p>
              </div>
            </Link>
            
            <Link
              href="/studio"
              style={{ 
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
                color: 'white', 
                padding: '10px 24px', 
                borderRadius: '12px', 
                fontWeight: '600', 
                fontSize: '14px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Create Headshots
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px 48px 24px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px', paddingTop: '48px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: '#dbeafe', 
            border: '1px solid #93c5fd', 
            borderRadius: '9999px', 
            padding: '8px 16px', 
            marginBottom: '24px' 
          }}>
            <Crown style={{ width: '16px', height: '16px', color: '#2563eb' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Professional AI Headshots
            </span>
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#111827', marginBottom: '24px', lineHeight: '1.1' }}>
            Choose Your <span style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Perfect Plan</span>
          </h1>
          
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '640px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Get professional headshots in minutes. No contracts, no hidden fees. 
            Pay only for what you need.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', fontSize: '14px', color: '#6b7280', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users style={{ width: '16px', height: '16px', color: '#10b981' }} />
              <span>250,000+ users</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star style={{ width: '16px', height: '16px', color: '#f59e0b', fill: 'currentColor' }} />
              <span>4.9/5 rating</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
              <span>Professional quality</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                backgroundColor: 'white',
                border: plan.popular ? '2px solid #3b82f6' : '2px solid #f3f4f6',
                borderRadius: '16px',
                padding: '32px',
                transition: 'all 0.3s ease',
                boxShadow: plan.popular ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)' }}>
                  <div style={{ 
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
                    color: 'white', 
                    padding: '8px 24px', 
                    borderRadius: '9999px', 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}>
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827' }}>{plan.price}</span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>{plan.credits}</span>
                  <span style={{ color: '#6b7280', marginLeft: '8px' }}>Credits</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>{plan.description}</p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Check style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                    <span style={{ color: '#374151' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 🔧 FIXED: Updated button to use handleBuyCreditsFixed */}
              <button
                onClick={() => {
                  if (plan.credits === 3) {
                    handleBuyCreditsFixed(3, 'KyLbF', 'IHKvU')
                  } else if (plan.credits === 10) {
                    handleBuyCreditsFixed(10, 'FzopO', 'VBfyi')
                  } else if (plan.credits === 15) {
                    handleBuyCreditsFixed(15, 'KUOpi', 'o0XfZ')
                  }
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '16px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ...(plan.popular
                    ? {
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }
                    : {
                        backgroundColor: '#f3f4f6',
                        color: '#111827'
                      })
                }}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* All Plans Include */}
        <div style={{ 
          background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', 
          borderRadius: '16px', 
          padding: '32px', 
          marginBottom: '64px' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '32px' }}>
            All Plans Include
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {allFeatures.map((feature, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  margin: '0 auto 16px' 
                }}>
                  {feature.icon}
                </div>
                <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>{feature.title}</h4>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: '64px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '32px' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', maxWidth: '1024px', margin: '0 auto' }}>
            {[
              {
                question: 'How do credits work?',
                answer: 'Each AI headshot generation costs 1 credit. Credits never expire and can be used anytime.'
              },
              {
                question: 'Can I get a refund?',
                answer: 'Yes, we offer refunds within 7 days of purchase if you haven\'t used any credits.'
              },
              {
                question: 'What if I don\'t like my headshots?',
                answer: 'You can regenerate with different settings. Each generation uses 1 credit.'
              },
              {
                question: 'Are there any hidden fees?',
                answer: 'No hidden fees. Pay once and use your credits whenever you need headshots.'
              }
            ].map((faq, index) => (
              <div key={index} style={{ 
                backgroundColor: 'white', 
                border: '1px solid #f3f4f6', 
                borderRadius: '12px', 
                padding: '24px' 
              }}>
                <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '12px' }}>{faq.question}</h4>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
          borderRadius: '16px', 
          padding: '48px', 
          color: 'white' 
        }}>
          <h3 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '16px' }}>
            Ready to Create Professional Headshots?
          </h3>
          <p style={{ fontSize: '20px', marginBottom: '32px', color: '#dbeafe' }}>
            Join thousands of professionals who trust Deeplab-ai
          </p>
          <Link
            href="/studio"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: 'white', 
              color: '#2563eb', 
              padding: '16px 32px', 
              borderRadius: '12px', 
              fontWeight: '700', 
              fontSize: '18px', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <Sparkles style={{ width: '24px', height: '24px' }} />
            Start Creating Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#111827', 
        color: 'white', 
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px', 
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <Link href="/help" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Help Center
            </Link>
            <Link href="/terms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Terms of Service
            </Link>
            <Link href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Privacy Policy
            </Link>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            &copy; 2024 Deeplab-ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PricingPage