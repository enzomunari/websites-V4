// src/app/help/page.tsx - Fixed Help Center page with proper styling
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, Users, Camera, Clock, Zap, Search } from 'lucide-react'

const HelpPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  const stats = [
    { icon: <Users size={24} />, number: '250K+', label: 'Happy Users' },
    { icon: <Camera size={24} />, number: '1M+', label: 'Photos Created' },
    { icon: <Clock size={24} />, number: '2 min', label: 'Average Time' },
    { icon: <Zap size={24} />, number: '99%', label: 'Success Rate' }
  ]

  const faqs = [
    {
      id: 'create-first',
      question: 'How do I create my first AI headshot?',
      answer: 'Simply upload a clear photo of yourself, select your preferred style and environment, then click Generate. Our AI will create a professional headshot in about 2 minutes.'
    },
    {
      id: 'photo-types',
      question: 'What type of photos work best?',
      answer: 'Use high-quality photos with good lighting where your face is clearly visible. Avoid sunglasses, hats, or heavy shadows. Front-facing photos work best.'
    },
    {
      id: 'generation-time',
      question: 'How long does it take to generate headshots?',
      answer: 'Most headshots are generated within 1-3 minutes. During peak times, it may take up to 5 minutes.'
    },
    {
      id: 'credits-work',
      question: 'How do credits work?',
      answer: 'Each headshot generation costs 1 credit. You can purchase credit packs or use our daily free trial. Credits never expire.'
    },
    {
      id: 'credits-expire',
      question: 'Do credits expire?',
      answer: 'No, credits never expire. You can use them whenever you want to generate new headshots.'
    },
    {
      id: 'refund-policy',
      question: 'Can I get a refund?',
      answer: 'We offer refunds within 7 days of purchase for unused credits. Technical issues that prevent service delivery may warrant refunds on a case-by-case basis. Contact us at deeplab-ai@proton.me'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '16px 0' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            textDecoration: 'none', 
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <ArrowLeft size={20} />
            Deeplab-ai
          </Link>
          <div style={{ color: '#d1d5db' }}>•</div>
          <span style={{ color: '#111827', fontWeight: '600' }}>Help Center</span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '60px 0', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            color: '#111827', 
            marginBottom: '16px',
            lineHeight: '1.1'
          }}>
            How can we help you?
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Find answers to common questions about creating professional AI headshots
          </p>
          
          {/* Search Box */}
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="text"
              placeholder="Search for help..."
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                backgroundColor: 'white',
                outline: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '40px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '32px',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '12px', 
                  color: '#3b82f6' 
                }}>
                  {stat.icon}
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '900', 
                  color: '#111827', 
                  marginBottom: '8px' 
                }}>
                  {stat.number}
                </div>
                <div style={{ color: '#6b7280', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section style={{ padding: '60px 0', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            textAlign: 'center', 
            marginBottom: '48px',
            color: '#111827'
          }}>
            ⭐ Getting Started
          </h2>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.filter(faq => ['create-first', 'photo-types', 'generation-time'].includes(faq.id)).map((faq) => (
              <div key={faq.id} style={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                marginBottom: '16px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    textAlign: 'left'
                  }}
                >
                  {faq.question}
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      color: '#6b7280',
                      transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </button>
                {openFAQ === faq.id && (
                  <div style={{ 
                    padding: '0 20px 20px', 
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credits & Pricing Section */}
      <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            textAlign: 'center', 
            marginBottom: '48px',
            color: '#111827'
          }}>
            💳 Credits & Pricing
          </h2>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.filter(faq => ['credits-work', 'credits-expire', 'refund-policy'].includes(faq.id)).map((faq) => (
              <div key={faq.id} style={{ 
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                marginBottom: '16px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    textAlign: 'left'
                  }}
                >
                  {faq.question}
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      color: '#6b7280',
                      transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </button>
                {openFAQ === faq.id && (
                  <div style={{ 
                    padding: '0 20px 20px', 
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '60px 0', 
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '16px' 
          }}>
            Ready to create your professional headshots?
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '32px' 
          }}>
            Join thousands of professionals who trust Deeplab-ai
          </p>
          <Link href="/studio" style={{ 
            display: 'inline-block',
            backgroundColor: 'white', 
            color: '#3b82f6', 
            padding: '16px 32px', 
            borderRadius: '12px', 
            fontWeight: '700', 
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            Create Headshots Now
          </Link>
        </div>
      </section>

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
            <Link href="/pricing" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Pricing
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

export default HelpPage