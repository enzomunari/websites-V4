'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Shield } from 'lucide-react'

const PrivacyPage: React.FC = () => {
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
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Privacy Policy</p>
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
        {/* Privacy Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', paddingTop: '48px' }}>
          <div style={{ 
            backgroundColor: '#dcfce7', 
            border: '1px solid #86efac', 
            borderRadius: '9999px', 
            padding: '12px 24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <Shield style={{ width: '24px', height: '24px', color: '#16a34a' }} />
            <span style={{ color: '#14532d', fontWeight: '600' }}>Your Privacy is Protected</span>
          </div>
        </div>

        <div style={{ maxWidth: 'none', lineHeight: '1.7', fontSize: '16px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', marginBottom: '32px', textAlign: 'center' }}>
            Privacy Policy
          </h1>
          
          <p style={{ color: '#6b7280', marginBottom: '32px', textAlign: 'center', fontSize: '16px' }}>
            Last updated: January 2024
          </p>

          <div style={{ 
            backgroundColor: '#dbeafe', 
            border: '1px solid #93c5fd', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '32px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e3a8a', marginBottom: '12px' }}>
              🔒 Key Privacy Commitments
            </h3>
            <ul style={{ color: '#1e40af', margin: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>• We automatically delete your uploaded photos after processing</li>
              <li style={{ marginBottom: '8px' }}>• Generated headshots are temporarily stored for download only</li>
              <li style={{ marginBottom: '8px' }}>• We never sell or share your personal data</li>
              <li style={{ marginBottom: '8px' }}>• All processing happens on secure, encrypted servers</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Information We Collect
          </h2>
          
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginTop: '24px', marginBottom: '12px' }}>
            Photos You Upload
          </h3>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            When you use our service, you upload photos that are processed by our AI to generate professional headshots. These photos are:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Processed immediately upon upload</li>
            <li style={{ marginBottom: '8px' }}>Automatically deleted within 24 hours</li>
            <li style={{ marginBottom: '8px' }}>Never used for training our AI models</li>
            <li style={{ marginBottom: '8px' }}>Never shared with third parties</li>
          </ul>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginTop: '24px', marginBottom: '12px' }}>
            Usage Information
          </h3>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            We collect basic usage information to improve our service:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Number of headshots generated</li>
            <li style={{ marginBottom: '8px' }}>Style and environment preferences</li>
            <li style={{ marginBottom: '8px' }}>Technical logs for troubleshooting</li>
            <li style={{ marginBottom: '8px' }}>Anonymous analytics data</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            How We Use Your Information
          </h2>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            Your information is used solely to:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Generate your requested headshots</li>
            <li style={{ marginBottom: '8px' }}>Provide customer support</li>
            <li style={{ marginBottom: '8px' }}>Improve our service quality</li>
            <li style={{ marginBottom: '8px' }}>Send service-related communications</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Data Security
          </h2>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            We implement industry-standard security measures:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>End-to-end encryption for all uploaded images</li>
            <li style={{ marginBottom: '8px' }}>Secure HTTPS connections for all data transmission</li>
            <li style={{ marginBottom: '8px' }}>Regular security audits and monitoring</li>
            <li style={{ marginBottom: '8px' }}>Limited access controls for our team</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Data Retention
          </h2>
          <div style={{ 
            backgroundColor: '#dcfce7', 
            border: '1px solid #86efac', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px' 
          }}>
            <h4 style={{ fontWeight: '700', color: '#14532d', marginBottom: '8px' }}>Uploaded Photos</h4>
            <p style={{ color: '#14532d', marginBottom: '12px' }}>Automatically deleted within 24 hours of upload</p>
            
            <h4 style={{ fontWeight: '700', color: '#14532d', marginBottom: '8px' }}>Generated Headshots</h4>
            <p style={{ color: '#14532d', marginBottom: '12px' }}>Available for download for 30 days, then permanently deleted</p>
            
            <h4 style={{ fontWeight: '700', color: '#14532d', marginBottom: '8px' }}>Account Information</h4>
            <p style={{ color: '#14532d', margin: 0 }}>Retained only as long as your account is active</p>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Your Rights
          </h2>
          <p style={{ color: '#374151', marginBottom: '16px' }}>You have the right to:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Request deletion of your account and all associated data</li>
            <li style={{ marginBottom: '8px' }}>Access information about what data we have collected</li>
            <li style={{ marginBottom: '8px' }}>Correct any inaccurate personal information</li>
            <li style={{ marginBottom: '8px' }}>Withdraw consent for data processing</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Cookies and Tracking
          </h2>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            We use minimal cookies and tracking technologies:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Essential cookies for service functionality</li>
            <li style={{ marginBottom: '8px' }}>Analytics cookies to understand usage patterns (anonymous)</li>
            <li style={{ marginBottom: '8px' }}>No advertising or marketing tracking</li>
            <li style={{ marginBottom: '8px' }}>You can disable cookies in your browser settings</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Third-Party Services
          </h2>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            We use select third-party services that comply with our privacy standards:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Payment processing (encrypted and secure)</li>
            <li style={{ marginBottom: '8px' }}>Cloud infrastructure (with data encryption)</li>
            <li style={{ marginBottom: '8px' }}>Analytics services (anonymized data only)</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            International Data Transfers
          </h2>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            Your data may be processed in countries other than your own. We ensure adequate protection through:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Standard contractual clauses</li>
            <li style={{ marginBottom: '8px' }}>Adequacy decisions by relevant authorities</li>
            <li style={{ marginBottom: '8px' }}>Other lawful transfer mechanisms</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Children's Privacy
          </h2>
          <p style={{ color: '#374151', marginBottom: '24px' }}>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Changes to This Policy
          </h2>
          <p style={{ color: '#374151', marginBottom: '24px' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginTop: '32px', marginBottom: '16px' }}>
            Contact Us
          </h2>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            padding: '24px' 
          }}>
            <p style={{ color: '#374151', marginBottom: '16px' }}>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul style={{ color: '#374151', margin: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>• Through our help center</li>
              <li style={{ marginBottom: '8px' }}>• By email deeplab-ai@proton.me</li>
  
            </ul>
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
            Your privacy is protected. Start creating professional headshots today.
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
            <Link href="/terms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Terms of Service
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

export default PrivacyPage