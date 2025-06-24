// utils/dataStorage.ts - Data storage utilities for tracking and admin - FIXED EXPORTS
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
  pose: string
  gender: string
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

// File paths
const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const GENERATIONS_FILE = path.join(DATA_DIR, 'generations.json')
const EVENTS_FILE = path.join(DATA_DIR, 'events.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create data directory:', error)
  }
}

// Read JSON file with error handling
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

// Write JSON file with error handling
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Failed to write ${filePath}:`, error)
  }
}

// Save user data
export async function saveUser(userData: UserData): Promise<void> {
  const users = await readJsonFile<Record<string, UserData>>(USERS_FILE, {})
  
  // Add site information
  const updatedUserData = {
    ...userData,
    site: 'nudeet',
    lastVisitDate: new Date().toISOString()
  }
  
  users[userData.userId] = updatedUserData
  await writeJsonFile(USERS_FILE, users)
  console.log('💾 User data saved:', userData.userId)
}

// MISSING EXPORTS - Add these functions that are being imported
export async function getUserData(deviceId: string): Promise<UserData | null> {
  try {
    const users = await readJsonFile<Record<string, UserData>>(USERS_FILE, {})
    const userData = Object.values(users).find((u: UserData) => u.deviceId === deviceId)
    
    if (userData) {
      console.log(`✅ Found user: ${userData.userId}, Credits: ${userData.credits}`)
      return userData
    } else {
      console.log(`❌ No user found for device ID: ${deviceId}`)
      return null
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export async function saveUserData(userData: UserData): Promise<void> {
  return await saveUser(userData)
}

// Get user by user ID
export async function getUserById(userId: string): Promise<UserData | null> {
  try {
    const users = await readJsonFile<Record<string, UserData>>(USERS_FILE, {})
    return users[userId] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Log generation event
export async function logGeneration(generationData: Omit<GenerationEvent, 'id' | 'site'>): Promise<void> {
  const generations = await readJsonFile<GenerationEvent[]>(GENERATIONS_FILE, [])
  
  const newGeneration: GenerationEvent = {
    ...generationData,
    id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    site: 'nudeet',
    timestamp: generationData.timestamp || new Date().toISOString()
  }
  
  generations.push(newGeneration)
  
  // Keep only last 1000 generations
  if (generations.length > 1000) {
    generations.splice(0, generations.length - 1000)
  }
  
  await writeJsonFile(GENERATIONS_FILE, generations)
  console.log('📊 Generation logged:', newGeneration.id)
}

// Log user event
export async function logUserEvent(eventData: Omit<UserEvent, 'id' | 'site'>): Promise<void> {
  const events = await readJsonFile<UserEvent[]>(EVENTS_FILE, [])
  
  const newEvent: UserEvent = {
    ...eventData,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    site: 'nudeet',
    timestamp: eventData.timestamp || new Date().toISOString()
  }
  
  events.push(newEvent)
  
  // Keep only last 5000 events
  if (events.length > 5000) {
    events.splice(0, events.length - 5000)
  }
  
  await writeJsonFile(EVENTS_FILE, events)
  console.log('📝 Event logged:', newEvent.action)
}

// Get all users
export async function getUsers(): Promise<Record<string, UserData>> {
  return await readJsonFile<Record<string, UserData>>(USERS_FILE, {})
}

// Get all generations
export async function getGenerations(): Promise<GenerationEvent[]> {
  return await readJsonFile<GenerationEvent[]>(GENERATIONS_FILE, [])
}

// Get all user events
export async function getUserEvents(): Promise<UserEvent[]> {
  return await readJsonFile<UserEvent[]>(EVENTS_FILE, [])
}

// Get site statistics
export async function getStats() {
  const users = await getUsers()
  const generations = await getGenerations()
  const events = await getUserEvents()
  
  const userList = Object.values(users)
  const totalUsers = userList.length
  const activeUsers = userList.filter(u => {
    const lastVisit = new Date(u.lastVisitDate)
    const daysSinceVisit = (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceVisit <= 7
  }).length
  
  const totalCredits = userList.reduce((sum, u) => sum + u.credits, 0)
  const totalGenerations = generations.length
  const successfulGenerations = generations.filter(g => g.success).length
  
  return {
    totalUsers,
    activeUsers,
    totalCredits,
    totalGenerations,
    successfulGenerations,
    successRate: totalGenerations > 0 ? ((successfulGenerations / totalGenerations) * 100).toFixed(1) : '0',
    totalEvents: events.length
  }
}

// Update user credits
export async function updateUserCredits(userId: string, newCredits: number): Promise<boolean> {
  try {
    const users = await getUsers()
    if (users[userId]) {
      users[userId].credits = newCredits
      users[userId].lastSyncDate = new Date().toISOString()
      await writeJsonFile(USERS_FILE, users)
      console.log(`💰 Updated user ${userId} credits to ${newCredits}`)
      return true
    }
    return false
  } catch (error) {
    console.error('Error updating user credits:', error)
    return false
  }
}

// Add credits to user
export async function addUserCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const users = await getUsers()
    if (users[userId]) {
      users[userId].credits += amount
      users[userId].lastSyncDate = new Date().toISOString()
      await writeJsonFile(USERS_FILE, users)
      console.log(`💰 Added ${amount} credits to user ${userId}. New total: ${users[userId].credits}`)
      return true
    }
    return false
  } catch (error) {
    console.error('Error adding user credits:', error)
    return false
  }
}

// Block/unblock user
export async function blockUser(userId: string, blocked: boolean): Promise<boolean> {
  try {
    const users = await getUsers()
    if (users[userId]) {
      users[userId].isBlocked = blocked
      users[userId].lastSyncDate = new Date().toISOString()
      await writeJsonFile(USERS_FILE, users)
      console.log(`🚫 ${blocked ? 'Blocked' : 'Unblocked'} user ${userId}`)
      return true
    }
    return false
  } catch (error) {
    console.error('Error blocking/unblocking user:', error)
    return false
  }
}

// Clean old data
export async function cleanOldData() {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    
    // Clean old events
    const events = await getUserEvents()
    const oldEventCount = events.length
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > cutoffDate
    )
    const eventsRemoved = oldEventCount - recentEvents.length
    
    if (eventsRemoved > 0) {
      await writeJsonFile(EVENTS_FILE, recentEvents)
    }
    
    // Clean old generations
    const generations = await getGenerations()
    const oldGenCount = generations.length
    const recentGenerations = generations.filter(gen => 
      new Date(gen.timestamp) > cutoffDate
    )
    const generationsRemoved = oldGenCount - recentGenerations.length
    
    if (generationsRemoved > 0) {
      await writeJsonFile(GENERATIONS_FILE, recentGenerations)
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