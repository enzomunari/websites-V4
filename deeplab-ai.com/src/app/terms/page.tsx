'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

const TermsPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        
        borderBottom: '1px solid #f3f4f6', 
        position: 'sticky', 
        top: 0, 
        zIndex: 40, 
        backdropFilter: 'blur(16px)', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)' 
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
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Terms of Service</p>
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

      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px 48px 24px' }}>
        <div style={{ maxWidth: 'none', padding: '48px 0' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', marginBottom: '32px', textAlign: 'center' }}>
            Terms of Service
          </h1>
          
          <p style={{ color: '#6b7280', marginBottom: '32px', textAlign: 'center', fontSize: '16px' }}>
            Last updated: January 2024
          </p>

          <div style={{ lineHeight: '1.7', fontSize: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              By accessing and using Deeplab-ai ('Service'), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              2. Use License
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              Permission is granted to temporarily use the Service for personal, commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
              <li style={{ marginBottom: '8px' }}>Modify or copy the materials</li>
              <li style={{ marginBottom: '8px' }}>Use the materials for any commercial purpose or for any public display</li>
              <li style={{ marginBottom: '8px' }}>Attempt to reverse engineer any software contained on the Service</li>
              <li style={{ marginBottom: '8px' }}>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              3. Image Rights and Usage
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              You retain full ownership and rights to any images you upload to our Service. Generated headshots are yours to use for any purpose, including commercial use. We do not claim any rights to your generated images.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              4. Privacy and Data Protection
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              Your privacy is important to us. Uploaded images are processed securely and automatically deleted from our servers after generation. We do not store or use your images for any purpose other than generating your requested headshots.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              5. Payment and Refunds
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              All purchases are final. Refunds may be provided at our discretion within 7 days of purchase for unused credits. Technical issues that prevent service delivery may warrant refunds on a case-by-case basis.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              6. Service Availability
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              We strive to maintain 99% uptime but cannot guarantee uninterrupted service. Maintenance windows and technical issues may temporarily affect service availability.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              7. Prohibited Uses
            </h2>
            <p style={{ color: '#374151', marginBottom: '16px' }}>
              You may not use our Service to:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
              <li style={{ marginBottom: '8px' }}>Generate images of minors without proper authorization</li>
              <li style={{ marginBottom: '8px' }}>Create fake or misleading profile images</li>
              <li style={{ marginBottom: '8px' }}>Violate any local, state, national, or international law</li>
              <li style={{ marginBottom: '8px' }}>Transmit, or procure the sending of, any advertising or promotional material</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              8. Disclaimer
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              The information on this Service is provided on an 'as is' basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
              9. Contact Information
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              If you have any questions about these Terms of Service, please contact us through our mail support at deeplab-ai@proton.me
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: '16px',
          padding: '48px',
          color: 'white',
          marginTop: '48px'
        }}>
          <h3 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '16px' }}>
            Ready to create professional headshots?
          </h3>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '32px' }}>
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
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}>
            Create Headshots Now
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
            <Link href="/pricing" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Pricing
            </Link>
            <Link href="/help" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Help Center
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

export default TermsPage