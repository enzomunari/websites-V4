// nudeet.ai/src/utils/sharedDataStorage.ts - Shared data storage utilities (same as Deeplab)
import fs from 'fs/promises'
import path from 'path'

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

interface GenerationEvent {
  id: string
  userId: string
  deviceId: string
  style?: string
  pose?: string
  environment?: string
  gender?: string
  success: boolean
  error?: string
  timestamp: string
  ipAddress?: string
  site: string
  workflowUsed?: string
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

// File paths - Try shared directory first, fall back to local
const SHARED_DATA_DIR = 'C:\\WEBSITES\\shared_data'
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data')

async function getDataDir(): Promise<string> {
  try {
    await fs.access(SHARED_DATA_DIR)
    return SHARED_DATA_DIR
  } catch {
    return LOCAL_DATA_DIR
  }
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = await getDataDir()
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    console.error('Failed to create data directory:', error)
  }
}

// Read JSON file with error handling
async function readJsonFile<T>(fileName: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir()
    const dataDir = await getDataDir()
    const filePath = path.join(dataDir, fileName)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

// Write JSON file with error handling
async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    const dataDir = await getDataDir()
    const filePath = path.join(dataDir, fileName)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Failed to write ${fileName}:`, error)
  }
}

// DIRECT DATABASE ACCESS FUNCTIONS (No fetch calls)

// Read unified users database directly
async function readUnifiedUsers(): Promise<Record<string, UserData>> {
  try {
    const dataDir = await getDataDir()
    const filePath = path.join(dataDir, 'unified_users.json')
    const data = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.users || parsed
  } catch (error) {
    console.error('Error reading unified users:', error)
    return {}
  }
}

// Write unified users database directly
async function writeUnifiedUsers(users: Record<string, UserData>): Promise<void> {
  try {
    const dataDir = await getDataDir()
    const filePath = path.join(dataDir, 'unified_users.json')
    const data = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      users: users
    }
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing unified users:', error)
  }
}

// Get single user by device ID
export async function getUser(deviceId: string): Promise<UserData | null> {
  try {
    const users = await readUnifiedUsers()
    const userData = Object.values(users).find((u: UserData) => u.deviceId === deviceId)
    
    if (userData) {
      console.log(`✅ Found user: ${userData.userId}, Credits: ${userData.credits}`)
      return userData
    } else {
      console.log(`❌ No user found for device ID: ${deviceId}`)
      return null
    }
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// Update user credits directly in database
export async function updateUserCredits(userId: string, newCredits: number): Promise<boolean> {
  try {
    const users = await readUnifiedUsers()
    
    if (users[userId]) {
      users[userId].credits = newCredits
      users[userId].lastSyncDate = new Date().toISOString()
      
      await writeUnifiedUsers(users)
      console.log(`✅ Updated credits for ${userId}: ${newCredits}`)
      return true
    } else {
      console.error(`❌ User ${userId} not found for credit update`)
      return false
    }
  } catch (error) {
    console.error('Error updating user credits:', error)
    return false
  }
}

// Record generation event
export async function recordGeneration(
  userId: string, 
  deviceId: string, 
  site: string, 
  success: boolean, 
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const generations = await readJsonFile<GenerationEvent[]>('generations.json', [])
    
    const newGeneration: GenerationEvent = {
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceId,
      site,
      success,
      timestamp: new Date().toISOString(),
      ...metadata
    }
    
    generations.push(newGeneration)
    
    // Keep only last 1000 generations
    if (generations.length > 1000) {
      generations.splice(0, generations.length - 1000)
    }
    
    await writeJsonFile('generations.json', generations)
    console.log('📊 Generation recorded:', newGeneration.id, success ? '✅' : '❌')
  } catch (error) {
    console.error('Error recording generation:', error)
  }
}

// Log user event
export async function logUserEvent(
  userId: string, 
  deviceId: string, 
  action: string, 
  site: string, 
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const events = await readJsonFile<UserEvent[]>('user_events.json', [])
    
    const newEvent: UserEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceId,
      action,
      site,
      timestamp: new Date().toISOString(),
      metadata
    }
    
    events.push(newEvent)
    
    // Keep only last 5000 events
    if (events.length > 5000) {
      events.splice(0, events.length - 5000)
    }
    
    await writeJsonFile('user_events.json', events)
    console.log('📝 User event logged:', action)
  } catch (error) {
    console.error('Error logging user event:', error)
  }
}

// Get all users - for admin dashboard
export async function getUsers(): Promise<Record<string, UserData>> {
  return await readUnifiedUsers()
}

// Get generations - for admin dashboard  
export async function getGenerations(): Promise<GenerationEvent[]> {
  return await readJsonFile<GenerationEvent[]>('generations.json', [])
}

// Get user events - for admin dashboard
export async function getUserEvents(): Promise<UserEvent[]> {
  return await readJsonFile<UserEvent[]>('user_events.json', [])
}

// Block/unblock user
export async function blockUser(userId: string, blocked: boolean): Promise<boolean> {
  try {
    const users = await readUnifiedUsers()
    
    if (users[userId]) {
      users[userId].isBlocked = blocked
      users[userId].lastSyncDate = new Date().toISOString()
      
      await writeUnifiedUsers(users)
      console.log(`✅ User ${userId} ${blocked ? 'blocked' : 'unblocked'}`)
      return true
    } else {
      console.error(`❌ User ${userId} not found`)
      return false
    }
  } catch (error) {
    console.error('Error setting user blocked status:', error)
    return false
  }
}

// Add credits to user
export async function addUserCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const users = await readUnifiedUsers()
    
    if (users[userId]) {
      users[userId].credits += amount
      users[userId].lastSyncDate = new Date().toISOString()
      
      await writeUnifiedUsers(users)
      console.log(`✅ Added ${amount} credits to ${userId}. New total: ${users[userId].credits}`)
      return true
    } else {
      console.error(`❌ User ${userId} not found for adding credits`)
      return false
    }
  } catch (error) {
    console.error('Error adding user credits:', error)
    return false
  }
}

// Get site statistics
export async function getStats(): Promise<{
  totalUsers: number
  totalGenerations: number
  totalSuccessfulGenerations: number
  totalFailedGenerations: number
  totalCreditsUsed: number
  activeUsers: number
  lastUpdated: string
}> {
  try {
    const users = await getUsers()
    const generations = await getGenerations()
    const events = await getUserEvents()
    
    // Filter by site
    const siteUsers = Object.values(users).filter(u => u.sitesUsed.includes('nudeet'))
    const siteGenerations = generations.filter((gen) => gen.site === 'nudeet')
    const siteEvents = events.filter((event) => event.site === 'nudeet')
    
    const totalUsers = siteUsers.length
    const totalGenerations = siteGenerations.length
    const totalSuccessfulGenerations = siteGenerations.filter(g => g.success).length
    const totalFailedGenerations = siteGenerations.filter(g => !g.success).length
    const totalCreditsUsed = siteUsers.reduce((sum, u) => sum + u.totalGenerations, 0)
    
    // Active users in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const activeUsers = siteUsers.filter(u => 
      new Date(u.lastVisitDate) > yesterday
    ).length
    
    return {
      totalUsers,
      totalGenerations,
      totalSuccessfulGenerations,
      totalFailedGenerations,
      totalCreditsUsed,
      activeUsers,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting site stats:', error)
    return {
      totalUsers: 0,
      totalGenerations: 0,
      totalSuccessfulGenerations: 0,
      totalFailedGenerations: 0,
      totalCreditsUsed: 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}

// Clean old data
export async function cleanOldData(): Promise<{
  eventsRemoved: number
  generationsRemoved: number
  message: string
}> {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    
    // Clean old events
    const events = await readJsonFile<UserEvent[]>('user_events.json', [])
    const oldEventCount = events.length
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > cutoffDate
    )
    const eventsRemoved = oldEventCount - recentEvents.length
    
    if (eventsRemoved > 0) {
      await writeJsonFile('user_events.json', recentEvents)
    }
    
    // Clean old generations
    const generations = await readJsonFile<GenerationEvent[]>('generations.json', [])
    const oldGenCount = generations.length
    const recentGenerations = generations.filter(gen => 
      new Date(gen.timestamp) > cutoffDate
    )
    const generationsRemoved = oldGenCount - recentGenerations.length
    
    if (generationsRemoved > 0) {
      await writeJsonFile('generations.json', recentGenerations)
    }
    
    const message = `Cleaned ${eventsRemoved} old events and ${generationsRemoved} old generations (older than 30 days)`
    console.log('🧹 ' + message)
    
    return {
      eventsRemoved,
      generationsRemoved,
      message
    }
  } catch (error) {
    console.error('Error cleaning old data:', error)
    return {
      eventsRemoved: 0,
      generationsRemoved: 0,
      message: 'Error cleaning old data: ' + (error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

// Export types for use in other files
export type { UserData, GenerationEvent, UserEvent }