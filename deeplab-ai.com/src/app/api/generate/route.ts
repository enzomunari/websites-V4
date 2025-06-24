// src/app/api/generate/route.ts - FIXED with correct function signatures
import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, access } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { 
  updateUserCredits, 
  recordGeneration, 
  logUserEvent,
  getUser
} from '@/utils/sharedDataStorage'

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  return response
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

interface ComfyUIWorkflow {
  [key: string]: {
    inputs: {
      [key: string]: string | number | boolean | unknown
    }
    class_type: string
    _meta?: {
      title: string
    }
  }
}

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Direct database access functions
async function readUserFromDatabase(deviceId: string) {
  try {
    // Try shared data directory first, fall back to local
    const SHARED_DB_PATH = 'C:\\WEBSITES\\shared_data\\unified_users.json'
    const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'unified_users.json')
    
    let dbPath = SHARED_DB_PATH
    try {
      await access(SHARED_DB_PATH)
    } catch {
      dbPath = LOCAL_DB_PATH
    }
    
    console.log(`🔍 Reading user data from: ${dbPath}`)
    
    const data = await readFile(dbPath, 'utf-8')
    const parsed = JSON.parse(data)
    const users = parsed.users || parsed
    
    // Find user by device ID
    const userData = Object.values(users).find((u: any) => u.deviceId === deviceId)
    
   if (userData) {
  // FIXED: Add type assertion to resolve TypeScript error
  const typedUserData = userData as { userId: string; credits: number; [key: string]: any }
  console.log(`✅ Found user data: ${typedUserData.userId}, Credits: ${typedUserData.credits}`)
  return userData
} else {
  console.log(`❌ No user found for device ID: ${deviceId}`)
      console.log(`🔍 Available device IDs:`, Object.values(users).map((u: any) => u.deviceId))
      return null
    }
  } catch (error) {
    console.error('❌ Error reading user data:', error)
    return null
  }
}

async function consumeUserCredit(userId: string) {
  try {
    // Try shared data directory first, fall back to local
    const SHARED_DB_PATH = 'C:\\WEBSITES\\shared_data\\unified_users.json'
    const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'unified_users.json')
    
    let dbPath = SHARED_DB_PATH
    try {
      await access(SHARED_DB_PATH)
    } catch {
      dbPath = LOCAL_DB_PATH
    }
    
    // Read current data
    const data = await readFile(dbPath, 'utf-8')
    const parsed = JSON.parse(data)
    const users = parsed.users || parsed
    
    // Update user credits
    if (users[userId]) {
      users[userId].credits -= 1
      users[userId].totalGenerations += 1
      users[userId].lastSyncDate = new Date().toISOString()
      
      // Write back to file
      const updatedData = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        users: users
      }
      await writeFile(dbPath, JSON.stringify(updatedData, null, 2))
      console.log(`✅ Credit consumed successfully. New balance: ${users[userId].credits}`)
      return users[userId].credits
    } else {
      console.error(`❌ User ${userId} not found for credit consumption`)
      return null
    }
  } catch (error) {
    console.error('❌ Error consuming credit:', error)
    return null
  }
}

// LOAD YOUR ACTUAL WORKFLOW FILE
async function loadYourActualWorkflow(): Promise<ComfyUIWorkflow> {
  try {
    const workflowPath = path.join(process.cwd(), 'proavatar_workflow.json')
    
    console.log('📁 Looking for workflow at:', workflowPath)
    
    if (!existsSync(workflowPath)) {
      throw new Error(`Workflow file not found at: ${workflowPath}`)
    }
    
    const workflowContent = await readFile(workflowPath, 'utf-8')
    const workflow = JSON.parse(workflowContent) as ComfyUIWorkflow
    
    console.log('✅ Successfully loaded your proavatar_workflow.json')
    console.log('🔧 Workflow contains nodes:', Object.keys(workflow).slice(0, 10))
    
    return workflow
  } catch (err) {
    console.error('❌ Failed to load proavatar_workflow.json:', err)
    throw new Error(`Failed to load workflow: ${err}`)
  }
}

// Upload image to ComfyUI
async function uploadImageToComfyUI(comfyUrl: string, imageFile: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('overwrite', 'true')
    
    console.log(`📤 Uploading image to ComfyUI: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(1)}MB)`)
    
    const response = await fetch(`${comfyUrl}/upload/image`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30000)
    })
    
    if (!response.ok) {
      throw new Error(`Image upload failed: HTTP ${response.status}`)
    }
    
    const result = await response.json()
    const uploadedFilename = result.name
    
    console.log(`✅ Image uploaded successfully: ${uploadedFilename}`)
    return uploadedFilename
    
  } catch (error) {
    console.error('❌ Image upload failed:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Modify YOUR workflow with uploaded image and prompts - UPDATED WITH NEW PROMPTS
function modifyWorkflowForGeneration(
  workflow: ComfyUIWorkflow,
  environment: string,
  style: string,
  uploadedImageFilename: string
): ComfyUIWorkflow {
  
  // Make a deep copy of your workflow
  const modifiedWorkflow: ComfyUIWorkflow = JSON.parse(JSON.stringify(workflow))
  
  console.log('🔧 Modifying your workflow with parameters:')
  console.log('📸 Uploaded image:', uploadedImageFilename)
  console.log('🏢 Environment:', environment)
  console.log('👔 Style:', style)
  console.log('🔍 Original workflow nodes:', Object.keys(workflow))
  
  // Base prompt - UPDATED
  const basePrompt = "professional portrait photo shoot, photography, perfect face, solo, high quality, 4k, hd, highly detailed face, perfect eyes, headshot, medium shot"
  
  // Environment-specific prompts - UPDATED
  const environmentPrompts: Record<string, string> = {
    'office': 'blurred corporate office background, formal, coorporate photo, linkedin profile portrait, professional lighting, depth of field, detailed indoor office background',
    'studio-white': 'plain white background, formal, coorporate photo, linkedin profile portrait, professional lighting, depth of field',
    'studio-grey': 'grey scale plain background, formal, coorporate photo, linkedin profile portrait, professional lighting, depth of field',
    'studio-color': 'plain color background, formal, professional lighting, coloured background, vibrant color, colorful modern backdrop background',
    'black-white': 'Black background, plain black background, dark background, professional lighting, vintage photo grain, ((classic black and white photo)), black&white, b&w, ((greyscale))',
    'outdoor': 'blurred office outdoor, Corporate Outdoor, formal, coorporate photo, linkedin profile portrait, professional lighting, depth of field, outdoor'
  }

  // Style-specific prompts - UPDATED
  const stylePrompts: Record<string, string> = {
    'suit': 'wearing a suit, wearing office suit, office shirt, executive',
    'casual': 'wearing casual clothes, casual, formal, modern look, casual look, decontracted',
    'formal': 'Wearing formal clothes, executive clothes, prenium formal wear'
  }

  // Build the complete positive prompt
  const positivePrompt = `${basePrompt}, ${environmentPrompts[environment] || environmentPrompts['office']}, ${stylePrompts[style] || stylePrompts['suit']}`

  const negativePrompt = "painting, big chin, tattoos, 3d, cgi, illustration, blur, earings, wedding dress, lowres, text, error, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, (4_persons), naked, nsfw, nude, tits sexy, (2_persons), Heterochromia, undressed, explicit, closeup, low neck, cleavage, facing camera, from front, sunglasses, full body"

  // Generation settings
  const steps = 10
  const cfg = 3.0

  // LOG ALL GENERATION PARAMETERS
  console.log('📝 GENERATION PARAMETERS:')
  console.log('✅ Positive prompt:', positivePrompt)
  console.log('❌ Negative prompt:', negativePrompt)
  console.log('🔢 Steps:', steps)
  console.log('⚙️ CFG:', cfg)
  console.log('🎯 Environment:', environment)
  console.log('👔 Style:', style)

  // 1. Update the image input node (node 525 based on your workflow)
  if (modifiedWorkflow["525"] && modifiedWorkflow["525"].inputs) {
    console.log('🔍 Found node 525, current image:', modifiedWorkflow["525"].inputs.image)
    modifiedWorkflow["525"].inputs.image = uploadedImageFilename
    console.log('✅ Updated node 525 with uploaded image:', uploadedImageFilename)
  } else {
    console.log('⚠️ Node 525 not found in workflow')
  }
  
  // 2. Update positive prompt (node 320 based on your workflow)
  if (modifiedWorkflow["320"] && modifiedWorkflow["320"].inputs) {
    console.log('🔍 Found node 320, current text length:', modifiedWorkflow["320"].inputs.text?.toString().length || 0)
    modifiedWorkflow["320"].inputs.text = positivePrompt
    console.log('✅ Updated node 320 with positive prompt')
  } else {
    console.log('⚠️ Node 320 not found in workflow')
  }
  
  // 3. Update negative prompt (node 12 based on your workflow)  
  if (modifiedWorkflow["12"] && modifiedWorkflow["12"].inputs) {
    console.log('🔍 Found node 12, current text length:', modifiedWorkflow["12"].inputs.text?.toString().length || 0)
    modifiedWorkflow["12"].inputs.text = negativePrompt
    console.log('✅ Updated node 12 with negative prompt')
  } else {
    console.log('⚠️ Node 12 not found in workflow')
  }
  
  // 4. Update session ID for saving (node 524)
  if (modifiedWorkflow["524"] && modifiedWorkflow["524"].inputs) {
    const sessionId = `deeplab_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('🔍 Found node 524, current session_id:', modifiedWorkflow["524"].inputs.session_id)
    modifiedWorkflow["524"].inputs.session_id = sessionId
    modifiedWorkflow["524"].inputs.user_hash = Math.random().toString(36).substr(2, 16)
    console.log('✅ Updated node 524 with session ID:', sessionId)
  } else {
    console.log('⚠️ Node 524 not found in workflow')
  }
  
  // 5. Update seed for randomization (node 14) and generation settings
  if (modifiedWorkflow["14"] && modifiedWorkflow["14"].inputs) {
    const seed = Math.floor(Math.random() * 4294967295)
    console.log('🔍 Found node 14, current seed:', modifiedWorkflow["14"].inputs.seed)
    modifiedWorkflow["14"].inputs.seed = seed
    modifiedWorkflow["14"].inputs.steps = steps
    modifiedWorkflow["14"].inputs.cfg = cfg
    console.log('✅ Updated node 14 with new seed:', seed, 'steps:', steps, 'cfg:', cfg)
  } else {
    console.log('⚠️ Node 14 not found in workflow')
  }
  
  // Check for missing critical nodes
  const criticalNodes = ['525', '320', '12', '524', '14']
  const missingNodes = criticalNodes.filter(nodeId => !modifiedWorkflow[nodeId])
  if (missingNodes.length > 0) {
    console.log('⚠️ WARNING: Missing critical nodes:', missingNodes)
    console.log('🔍 Available nodes in workflow:', Object.keys(modifiedWorkflow).slice(0, 20))
  }
  
  console.log('🎯 Workflow modification complete!')
  
  return modifiedWorkflow
}

async function checkComfyUIStatus(comfyUrl: string): Promise<{ status: string, error?: string }> {
  try {
    console.log(`🔍 Checking ComfyUI status at: ${comfyUrl}`)
    
    const response = await fetch(`${comfyUrl}/system_stats`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      console.log('✅ ComfyUI is running and accessible')
      return { status: 'running' }
    } else {
      console.log(`⚠️ ComfyUI responded with status: ${response.status}`)
      return { status: 'error', error: `ComfyUI returned status ${response.status}` }
    }
  } catch (error) {
    console.error('❌ ComfyUI connection failed:', error)
    return { 
      status: 'offline', 
      error: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}

async function submitToComfyUI(workflow: ComfyUIWorkflow): Promise<string> {
  const comfyUrl = process.env.COMFY_URL || 'http://127.0.0.1:8188'
  
  try {
    console.log('🎨 Submitting YOUR actual workflow to ComfyUI...')
    console.log(`🌐 ComfyUI URL: ${comfyUrl}`)
    
    // First check if ComfyUI is accessible
    const statusCheck = await checkComfyUIStatus(comfyUrl)
    if (statusCheck.status !== 'running') {
      throw new Error(`ComfyUI is not accessible: ${statusCheck.error || statusCheck.status}`)
    }
    
    // FIXED: Remove extra_pnginfo to avoid KeyError
    const payload = {
      prompt: workflow
    }
    
    console.log('📤 Submitting workflow to ComfyUI...')
    console.log('🔧 Workflow nodes being submitted:', Object.keys(workflow))
    
    const promptResponse = await fetch(`${comfyUrl}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000)
    })

    console.log(`📡 ComfyUI response status: ${promptResponse.status}`)

    if (!promptResponse.ok) {
      let errorDetails = `HTTP ${promptResponse.status}`
      try {
        const errorBody = await promptResponse.text()
        console.error('❌ ComfyUI error response:', errorBody)
        errorDetails += `: ${errorBody}`
      } catch {
        console.error('❌ Could not read error response body')
      }
      throw new Error(`ComfyUI prompt submission failed: ${errorDetails}`)
    }

    const promptResult = await promptResponse.json()
    const promptId = promptResult.prompt_id
    
    console.log(`📝 Generation prompt submitted with ID: ${promptId}`)

    // Poll for completion
    let attempts = 0
    const maxAttempts = 60 // 5 minutes timeout
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      
      try {
        const historyResponse = await fetch(`${comfyUrl}/history/${promptId}`, {
          signal: AbortSignal.timeout(10000)
        })
        
        if (historyResponse.ok) {
          const history = await historyResponse.json()
          
          if (history[promptId]) {
            const execution = history[promptId]
            
            if (execution.status?.status_str === 'success') {
              console.log('✅ Generation completed successfully using YOUR workflow!')
              
              // Extract the generated image URL from the outputs
              const outputs = execution.outputs
              console.log('🔍 Available output nodes:', Object.keys(outputs))
              
              // Log all outputs for debugging
              for (const nodeId in outputs) {
                const output = outputs[nodeId]
                if (output.images && output.images.length > 0) {
                  console.log(`📷 Node ${nodeId} has ${output.images.length} images:`, output.images.map((img: { filename: string }) => img.filename))
                }
              }
              
              // CORRECTED PRIORITY ORDER FOR FINAL FACE-SWAPPED IMAGES
              
              // Priority 1: Try final save node 524 - this should be the final JPG output after face swap
              if (outputs["524"] && outputs["524"].images && outputs["524"].images.length > 0) {
                const image = outputs["524"].images[0]
                const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                console.log(`🖼️ Final save JPG from node 524: ${imageUrl}`)
                return imageUrl
              }
              
              // Priority 2: Try upscale node 540 - upscaled final result
              if (outputs["540"] && outputs["540"].images && outputs["540"].images.length > 0) {
                const image = outputs["540"].images[0]
                const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                console.log(`🖼️ Upscaled final image from node 540: ${imageUrl}`)
                return imageUrl
              }
              
              // Priority 3: Try ReActor face swap node 89 - this is the actual face-swapped result
              if (outputs["89"] && outputs["89"].images && outputs["89"].images.length > 0) {
                const image = outputs["89"].images[0]
                const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                console.log(`🖼️ Face swap result from node 89: ${imageUrl}`)
                return imageUrl
              }
              
              // Priority 4: Try composite/final processing node 562
              if (outputs["562"] && outputs["562"].images && outputs["562"].images.length > 0) {
                const image = outputs["562"].images[0]
                const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                console.log(`🖼️ Composite image from node 562: ${imageUrl}`)
                return imageUrl
              }
              
              // Priority 5: Try any node with a number > 500 (likely final processing nodes)
              const highNumberedNodes = Object.keys(outputs)
                .filter(nodeId => parseInt(nodeId) > 500)
                .sort((a, b) => parseInt(b) - parseInt(a)) // Descending order
              
              for (const nodeId of highNumberedNodes) {
                const output = outputs[nodeId]
                if (output.images && output.images.length > 0) {
                  const image = output.images[0]
                  const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                  console.log(`🖼️ High-numbered node ${nodeId} image: ${imageUrl}`)
                  return imageUrl
                }
              }
              
              // Priority 6: Avoid VAE decode node 15 (pre-face-swap) unless no other option
              if (outputs["15"] && outputs["15"].images && outputs["15"].images.length > 0) {
                const image = outputs["15"].images[0]
                const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                console.log(`🖼️ VAE decoded image from node 15 (pre-face-swap): ${imageUrl}`)
                return imageUrl
              }
              
              // Last resort: Try any remaining node with images
              for (const nodeId in outputs) {
                const output = outputs[nodeId]
                if (output.images && output.images.length > 0) {
                  const image = output.images[0]
                  const imageUrl = `${comfyUrl}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type || 'output'}`
                  console.log(`🖼️ Last resort image from node ${nodeId}: ${imageUrl}`)
                  return imageUrl
                }
              }
              
              console.error('❌ No output images found in any node')
              throw new Error('No output images found in successful generation')
            } else if (execution.status?.status_str === 'error') {
              console.error('❌ ComfyUI generation failed - Full execution object:', JSON.stringify(execution, null, 2))
              
              // Better error message extraction
              let detailedError = 'Unknown ComfyUI error'
              if (execution.status?.messages && Array.isArray(execution.status.messages)) {
                const errorMessages = execution.status.messages
                  .filter((msg: unknown[]) => Array.isArray(msg) && msg[0] === 'execution_error')
                  .map((msg: unknown[]) => {
                    if (msg[1] && typeof msg[1] === 'object') {
                      return JSON.stringify(msg[1], null, 2)
                    }
                    return msg[1]
                  })
                
                if (errorMessages.length > 0) {
                  detailedError = errorMessages.join('\n')
                }
              }
              
              console.error('❌ Extracted error details:', detailedError)
              throw new Error(`Generation failed on ComfyUI: ${detailedError}`)
            }
          }
        } else {
          console.log(`⚠️ History check failed with status: ${historyResponse.status}`)
        }
      } catch (pollError) {
        console.warn(`⚠️ Polling attempt ${attempts + 1} failed:`, pollError)
      }
      
      attempts++
      console.log(`⏳ Waiting for generation... (${attempts}/${maxAttempts})`)
    }
    
    throw new Error('Generation timeout - please try again')
    
  } catch (error) {
    console.error('💥 ComfyUI submission error:', error)
    throw error
  }
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload JPG, PNG, or WebP images only.'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File too large. Maximum size is 10MB.'
  }
  return null
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🎨 Professional headshot generation request received')
    
    // Extract request data
    const formData = await request.formData()
    const image = formData.get('image') as File
    const environment = formData.get('environment') as string || 'office'
    const style = formData.get('style') as string || 'suit'
    const userId = formData.get('userId') as string
    const deviceId = formData.get('deviceId') as string

    // Get client IP
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    console.log(`📁 Will use YOUR actual proavatar_workflow.json file`)
    console.log(`🎨 Generation request: ${environment}, ${style}, user: ${userId}, device: ${deviceId}`)

    // Validate required fields
    if (!image || !userId || !deviceId) {
      console.log('❌ Missing required fields')
      return addCorsHeaders(NextResponse.json(
        { error: 'Missing required fields: image, userId, and deviceId are required' },
        { status: 400 }
      ))
    }

    // Validate file
    const fileValidation = validateFile(image)
    if (fileValidation) {
      console.log('❌ File validation failed:', fileValidation)
      return addCorsHeaders(NextResponse.json(
        { error: fileValidation },
        { status: 400 }
      ))
    }

    // Check if user has credits using direct database access
    console.log(`🔍 Checking credits for user: ${userId}, device: ${deviceId}`)
    const userData = await readUserFromDatabase(deviceId)

// FIXED: Add type assertion to resolve TypeScript error
const typedUserData = userData as { userId: string; credits: number; isBlocked?: boolean; [key: string]: any } | null

if (!typedUserData || typedUserData.credits < 1) {
  console.log(`❌ User ${userId} has insufficient credits: ${typedUserData?.credits || 0}`)
      return addCorsHeaders(NextResponse.json(
        { 
          error: 'Insufficient credits', 
          creditsRemaining: typedUserData?.credits || 0,
          message: 'You need at least 1 credit to generate a professional headshot'
        },
        { status: 402 }
      ))
    }

    console.log(`✅ User ${userId} has ${typedUserData.credits} credits, proceeding with generation`)

    // Check if user is blocked
    if (typedUserData.isBlocked) {
      console.log(`❌ User ${userId} is blocked`)
      return addCorsHeaders(NextResponse.json(
        { error: 'Account blocked', message: 'Your account has been blocked. Please contact support.' },
        { status: 403 }
      ))
    }

    try {
      // 1. Load YOUR actual workflow file
      const baseWorkflow = await loadYourActualWorkflow()
      
      // 2. Upload user image to ComfyUI
      const comfyUrl = process.env.COMFY_URL || 'http://127.0.0.1:8188'
      const uploadedImageFilename = await uploadImageToComfyUI(comfyUrl, image)
      
      // 3. Modify YOUR workflow with the uploaded image and prompts
      const finalWorkflow = modifyWorkflowForGeneration(baseWorkflow, environment, style, uploadedImageFilename)
      
      // 4. Submit YOUR modified workflow to ComfyUI
      const imageUrl = await submitToComfyUI(finalWorkflow)
      
      // Success - deduct credit using direct database access
      const newCredits = await consumeUserCredit(typedUserData.userId)
      
      // FIXED: Use correct function signature with correct parameter order
      await recordGeneration(userId, deviceId, 'deeplab', true, {
        environment,
        style,
        ipAddress: clientIp,
        workflowUsed: 'proavatar_workflow.json'
      })
      
      // FIXED: Use correct function signature with correct parameter order  
      await logUserEvent(userId, deviceId, 'professional_headshot_generation_completed', 'deeplab', {
        environment,
        style,
        success: true,
        imageUrl,
        ipAddress: clientIp
      })

      console.log(`✅ Professional headshot generation successful for user ${userId}`)

      return addCorsHeaders(NextResponse.json({
        success: true,
        imageUrl,
        creditsRemaining: newCredits !== null ? newCredits : typedUserData.credits - 1,
        message: 'Professional headshot generated successfully using YOUR workflow!'
      }))

    } catch (generationError) {
      console.error('❌ Professional headshot generation failed:', generationError)
      
      const errorMessage = generationError instanceof Error ? generationError.message : 'Unknown error'
      
      // FIXED: Use correct function signature with correct parameter order
      await recordGeneration(userId, deviceId, 'deeplab', false, {
        environment,
        style,
        error: errorMessage,
        ipAddress: clientIp
      })
      
      // FIXED: Use correct function signature with correct parameter order
      await logUserEvent(userId, deviceId, 'professional_headshot_generation_failed', 'deeplab', {
        environment,
        style,
        error: errorMessage,
        ipAddress: clientIp
      })

      // Provide helpful error messages
      let userFriendlyError = 'Professional headshot generation failed. Please try again.'
      
      if (errorMessage.includes('Workflow file not found')) {
        userFriendlyError = 'Workflow configuration missing. Please check server setup.'
      } else if (errorMessage.includes('not accessible') || errorMessage.includes('offline')) {
        userFriendlyError = 'AI service is temporarily unavailable. Please try again in a few minutes.'
      } else if (errorMessage.includes('timeout')) {
        userFriendlyError = 'Generation is taking longer than expected. Please try again.'
      } else if (errorMessage.includes('upload')) {
        userFriendlyError = 'Failed to upload your image. Please try a different image or try again.'
      }

      return addCorsHeaders(NextResponse.json({
        error: userFriendlyError,
        details: errorMessage,
        creditsRemaining: typedUserData.credits // Don't deduct credits on failure
      }, { status: 500 }))
    }

  } catch (error) {
    console.error('💥 Professional headshot generation API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const processingTime = Date.now() - startTime
    
    return addCorsHeaders(NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to process professional headshot generation request',
      details: errorMessage,
      processingTime
    }, { status: 500 }))
  }
}