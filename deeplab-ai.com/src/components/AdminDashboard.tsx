// components/AdminDashboard.tsx - FIXED admin dashboard component (no top-level await)
import React, { useState, useEffect, useCallback } from 'react'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Shield, 
  Plus, 
  Minus, 
  Search, 
  RefreshCw, 
  Ban, 
  Check,
  AlertTriangle,
  Zap 
} from 'lucide-react'

// Interfaces
interface UserData {
  userId: string
  deviceId: string
  credits: number
  lastFreeTrialDate: string | null
  firstVisitDate: string
  lastVisitDate: string
  totalGenerations: number
  totalFreeTrialsUsed: number
  isBlocked: boolean
  sitesUsed: string[]
  lastSyncDate: string
  ipAddress?: string
}

interface GenerationRecord {
  id: string
  userId: string
  deviceId: string
  style?: string
  environment?: string
  success: boolean
  error?: string
  timestamp: string
  ipAddress?: string
  site: string
}

interface UserEvent {
  id: string
  userId: string
  deviceId: string
  action: string
  timestamp: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  site: string
}

interface AdminStats {
  totalUsers: number
  totalGenerations: number
  totalSuccessfulGenerations: number
  totalFailedGenerations: number
  totalCreditsUsed: number
  activeUsers: number
  lastUpdated: string
}

const AdminDashboard: React.FC = () => {
  // State
  const [users, setUsers] = useState<Record<string, UserData>>({})
  const [generations, setGenerations] = useState<GenerationRecord[]>([])
  const [events, setEvents] = useState<UserEvent[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'generations' | 'events'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all')
  
  // Credit management state
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [creditAmount, setCreditAmount] = useState<number>(0)
  const [showCreditModal, setShowCreditModal] = useState(false)

  // Get admin password from session storage
  const getAdminPassword = () => {
    const password = sessionStorage.getItem('deeplab_admin_password')
    if (!password) {
      throw new Error('No admin session found')
    }
    return password
  }

  // Fetch data from API
  const fetchData = async (endpoint: string) => {
    const adminPassword = getAdminPassword()
    
    const response = await fetch(`/api/admin?type=${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status}`)
    }

    return response.json()
  }

  // Perform admin actions
  const performAction = async (action: string, data: Record<string, unknown> = {}) => {
    const adminPassword = getAdminPassword()

    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, ...data })
    })

    if (!response.ok) {
      throw new Error(`Action ${action} failed: ${response.status}`)
    }

    return response.json()
  }

  // Load all admin data
  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, usersData, generationsData, eventsData] = await Promise.all([
        fetchData('stats'),
        fetchData('users'),
        fetchData('generations'),
        fetchData('userEvents')
      ])

      setStats(statsData)
      setUsers(usersData)
      // Sort by most recent first
      setGenerations(generationsData.sort((a: GenerationRecord, b: GenerationRecord) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ))
      setEvents(eventsData.sort((a: UserEvent, b: UserEvent) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ))
    } catch (err) {
      console.error('Failed to load admin data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount and set up refresh interval
  useEffect(() => {
    loadAllData()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Add credits to user with custom amount
  const addCreditsToUser = async (userId: string, amount: number) => {
    try {
      if (amount === 0) {
        alert('Please enter a valid amount')
        return
      }
      
      await performAction('addCredits', { userId, amount })
      await loadAllData() // Refresh data
      alert(`Successfully ${amount > 0 ? 'added' : 'removed'} ${Math.abs(amount)} credits ${amount > 0 ? 'to' : 'from'} user`)
      setShowCreditModal(false)
      setSelectedUserId('')
      setCreditAmount(0)
    } catch (err) {
      console.error('Failed to modify credits:', err)
      alert('Failed to modify credits')
    }
  }

  // Open credit modal for specific user
  const openCreditModal = (userId: string) => {
    setSelectedUserId(userId)
    setShowCreditModal(true)
    setCreditAmount(0)
  }

  // Toggle user block status
  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      await performAction('blockUser', { userId, blocked: !isBlocked })
      await loadAllData() // Refresh data
      alert(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully`)
    } catch (err) {
      console.error('Failed to toggle user block:', err)
      alert('Failed to update user status')
    }
  }

  // Clean old data
  const cleanOldData = async () => {
    if (!confirm('Are you sure you want to clean old data? This will remove events and generations older than 30 days.')) {
      return
    }

    try {
      await performAction('cleanOldData')
      await loadAllData() // Refresh data
      alert('Old data cleaned successfully')
    } catch (err) {
      console.error('Failed to clean old data:', err)
      alert('Failed to clean old data')
    }
  }

  // Filter users based on search and status
  const filteredUsers = Object.values(users).filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && !user.isBlocked) ||
      (filterStatus === 'blocked' && user.isBlocked)
    
    return matchesSearch && matchesStatus
  })

  // Format precise timestamp for display
  const formatPreciseTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  if (loading && Object.keys(users).length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <RefreshCw style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '8px' }}>Loading admin dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fee2e2', 
        color: '#dc2626', 
        borderRadius: '8px',
        margin: '20px'
      }}>
        <AlertTriangle style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
        Error: {error}
        <button 
          onClick={loadAllData}
          style={{ 
            marginLeft: '16px', 
            padding: '4px 8px', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          DeepLab Admin Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={loadAllData}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <button
            onClick={cleanOldData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Clean Old Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <nav style={{ display: 'flex', gap: '32px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'generations', label: 'Generations', icon: Activity },
            { id: 'events', label: 'Events', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === id ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontWeight: activeTab === id ? '600' : '400'
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Users</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.totalUsers}</p>
                </div>
                <Users style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Generations</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.totalGenerations}</p>
                </div>
                <Activity style={{ width: '24px', height: '24px', color: '#10b981' }} />
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Success Rate</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {stats.totalGenerations > 0 ? Math.round((stats.totalSuccessfulGenerations / stats.totalGenerations) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Active Users</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.activeUsers}</p>
                </div>
                <Shield style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search by user ID or device ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 8px 8px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="blocked">Blocked Users</option>
            </select>
          </div>

          {/* Users Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Credits</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Generations</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Last Visit</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{user.userId}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.deviceId}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.credits}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{user.totalGenerations}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                      {formatPreciseTimestamp(user.lastVisitDate)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: user.isBlocked ? '#fee2e2' : '#d1fae5',
                        color: user.isBlocked ? '#dc2626' : '#065f46'
                      }}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openCreditModal(user.userId)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Credits
                        </button>
                        <button
                          onClick={() => toggleUserBlock(user.userId, user.isBlocked)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: user.isBlocked ? '#10b981' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generations Tab */}
      {activeTab === 'generations' && (
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Style/Environment</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Error</th>
                </tr>
              </thead>
              <tbody>
                {generations.slice(0, 50).map((gen) => (
                  <tr key={gen.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#1f2937' }}>{gen.userId}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{gen.deviceId}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {gen.style && gen.environment ? `${gen.style} / ${gen.environment}` : 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: gen.success ? '#d1fae5' : '#fee2e2',
                        color: gen.success ? '#065f46' : '#dc2626'
                      }}>
                        {gen.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                      {formatPreciseTimestamp(gen.timestamp)}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#ef4444' }}>
                      {gen.error || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 100).map((event) => (
                  <tr key={event.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#1f2937' }}>{event.userId}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{event.deviceId}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{event.action}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                      {formatPreciseTimestamp(event.timestamp)}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                      {event.metadata ? JSON.stringify(event.metadata).substring(0, 100) + '...' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Management Modal */}
      {showCreditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            minWidth: '400px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
              Manage Credits for User: {selectedUserId}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Credit Amount (positive to add, negative to remove):
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter amount (e.g., 10 or -5)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px', fontSize: '12px', color: '#6b7280' }}>
              Current credits: {users[selectedUserId]?.credits || 0}
              {creditAmount !== 0 && (
                <span style={{ fontWeight: '500', color: creditAmount > 0 ? '#059669' : '#dc2626' }}>
                  {' → '} {(users[selectedUserId]?.credits || 0) + creditAmount}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreditModal(false)
                  setSelectedUserId('')
                  setCreditAmount(0)
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => addCreditsToUser(selectedUserId, creditAmount)}
                disabled={creditAmount === 0}
                style={{
                  padding: '8px 16px',
                  backgroundColor: creditAmount === 0 ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: creditAmount === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {creditAmount > 0 ? 'Add Credits' : creditAmount < 0 ? 'Remove Credits' : 'No Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard