// components/ImageUploadPanel.tsx - DEV VERSION with editable prompts and percentage age
"use client"

import { Upload, X, ChevronDown, ChevronUp, User, Calendar, HelpCircle, Droplets, Camera, Edit3 } from 'lucide-react'
import { AdvancedOptions } from '@/types'
import { useState } from 'react'
import Image from 'next/image'

interface EditablePrompts {
  basePrompt: string;
  posePrompt: string;
  negativePrompt: string;
}

interface ImageUploadPanelProps {
  preview: string | null;
  showAdvanced: boolean;
  advancedOptions: AdvancedOptions;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onToggleAdvanced: () => void;
  onOptionsChange: (options: AdvancedOptions) => void;
  onUploadBoxClick: () => void;
  hasUploadedFirstImage: boolean;
  uploadKey: number;
  isLoading?: boolean;
  useFaceReference: boolean;
  onUseFaceReferenceChange: (value: boolean) => void;
  // DEV: New props for editable prompts
  editablePrompts: EditablePrompts;
  onEditablePromptsChange: (prompts: EditablePrompts) => void;
}

export const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
  preview,
  showAdvanced,
  advancedOptions,
  onImageUpload,
  onClearImage,
  onToggleAdvanced,
  onOptionsChange,
  onUploadBoxClick,
  hasUploadedFirstImage,
  uploadKey,
  useFaceReference,
  onUseFaceReferenceChange,
  editablePrompts,
  onEditablePromptsChange
}) => {
  const [showHelp, setShowHelp] = useState(false);

  // Female poses with standing-front and standing-back first
  const femalePoseIcons = {
    'standing-front': '🧍',
    'standing-back': '🚶',
    'selfie': '🤳',
	'gagging': '😯',
	'squirting': '💧',
	'hand-on-head': '🖐️',
    'pants-down': '👖',
    'from above': '⬇️',
    'laying-legs-open': '🛏️',
    'ass-spread': '🍑',
    'doggystyle': '🐕',
    'missionary-pov': '👁️',
    'oral-pov': '💋',
    'cumshot': '💦',
    'tongue-out': '👅',
    'blowjob': '🫦',
    'shower': '🚿',
    'sucking': '👄'
  }

  const femalePoseLabels = {
    'standing-front': 'Standing Front',
    'standing-back': 'Standing Back',
    'selfie': 'Selfie',
	'gagging': 'Gagging',
	'squirting': 'Squirting',
	'hand-on-head': 'Hand on Head️',
    'pants-down': 'Pants Down',
    'from above': 'From Above',
    'laying-legs-open': 'Laying Open',
    'ass-spread': 'Ass Spread',
    'doggystyle': 'Doggystyle',
    'missionary-pov': 'Missionary POV',
    'oral-pov': 'Oral POV',
    'cumshot': 'Cumshot',
    'tongue-out': 'Tongue Out',
    'blowjob': 'Blowjob',
    'shower': 'Shower',
    'sucking': 'Sucking'
  }

  // Male poses (4 poses with standing first)
  const malePoseIcons = {
    'standing-front-male': '🧍',
    'from behind-male': '🔄',
    'shower-male': '🚿',
    'spread legs-male': '🦵'
  }

  const malePoseLabels = {
    'standing-front-male': 'Standing',
    'from behind-male': 'From Behind',
    'shower-male': 'Shower',
    'spread legs-male': 'Spread Legs'
  }

  // Get current pose configuration based on gender
  const currentPoseIcons = advancedOptions.gender === 'male' ? malePoseIcons : femalePoseIcons;
  const currentPoseLabels = advancedOptions.gender === 'male' ? malePoseLabels : femalePoseLabels;
  const validPoses = Object.keys(currentPoseIcons) as (keyof typeof currentPoseIcons)[];

  // Check if current pose is valid for the selected gender
  const isCurrentPoseValid = validPoses.includes(advancedOptions.pose as keyof typeof currentPoseIcons);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🖼️ New image upload triggered');
    onImageUpload(e);
  }

  const handleClearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🗑️ Clearing uploaded image');
    onClearImage();
  }

  const handleUploadClick = () => {
    console.log('🖱️ Upload box clicked, hasUploadedFirstImage:', hasUploadedFirstImage)
    if (!hasUploadedFirstImage) {
      onUploadBoxClick();
    } else {
      const fileInput = document.getElementById(`upload-input-main`) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  // DEV: Pose configurations with prompts (matching the API)
  const poseConfigs: Record<string, { prompt: string }> = {
    'selfie': {
      prompt: 'selfieslut, ((amateur selfie taken by a pretty girl)), (((wearing sexy outfit in her bedroom))), (lingerie), upskirt, solo, revealing, pussy, mirror shot, phone, low resolution, grainy, low quality, from above, bed'
    },
    'squirting': {
      prompt: 'masterpiece,best quality, (a photo of a Beautiful 18 year old girl masturbating squirting excessive pussy juice from her vagina and woman is squirting excessive pussy juice from her vagina upwards and squirting excessive pussy juice from her pussy over her head and squirting excessive pussy juice from her pussy into the air),(woman pussy juice is squirting onto the camera and wet lens), closed eyes, orgasm,flash photography, squatting,(motion blur:1.3) and (blurred foreground:1.3), ass visible through thighs, arms behind back, <lora:squirting_female ejaculation_SDXL-V1:0.8>'
    },
    'hand-on-head': {
      prompt: 'score_9, score_8_up, score_7_up, realistic skin, dynamic light, warm_light, vibrant colors warm_colors, soft focus, high contrast, textured surfaces, depth of field, rich details, (4K image quality:1.3), (sharp detail:1.3), (highly realistic:1.3), (dim warm cinematic lighting:1.1), sweat, open mouth, saliva, getting face fucked,( hairgrabblowjob:1.2), deepthroat, huge penis'
    },
    'gagging': {
      prompt: '<lora:41B5833439:0.7> giving a deep throat blowjob on top sloppy spit on her face snot coming out of her nose, enormous penis, hairgrabblowjob, hand on head, ((cum dripping, drooling, excessive saliva dripping, dripping from mouth, dripping from nose)), blowjob, g4g, g4gging'
    },
    'pants-down': {
      prompt: 'masterpiece, ,(solo:1.1), perfect face, (lingerie), pants, (((panties))), underwear, (bright lighting:1.2),beautiful detailed eyes, extremely detailed face, perfect lighting,masterpiece, best quality, (female), 1girl ,anus,pussy, ass, from behind, clothes pull, pants,underwear, looking back, pants pull, <lora:MS_Real_PantsDown:1>'
    },
    'standing-front': {
      prompt: 'standing pose, front view, soft silhouette, boobs, perfect face, beautiful face, beautiful eyes'
    },
    'standing-back': {
      prompt: 'Rearviewspread, anus, rear shot, back view, rear view, looking at viewer, innie pussy, cameltoe, ass, rear pussy, (look back:1.2), innie, closeup <lora:rearpussy-xl-1.0:1> , 35mm photograph, bokeh, professional, 4k, highly detailed, girl bedroom, ((fully naked))'
    },
    'from above': {
      prompt: 'ass, ((on stomach)), ((fully naked)), lying on bed, (from behind), from above, 1girl, solo, pillow, looking at viewer, looking back, <lora:ass-from-behind:0.9>, ((masterpiece, best quality)), highres, legs together, ((((legs closed)))), perfect butt, prone bov, from above'
    },
    'laying-legs-open': {
      prompt: 'laying pose, legs spread, ((fully naked)), lying down, spread legs, cameltoe'
    },
    'ass-spread': {
      prompt: 'score_9, score_8_up, score_7_up, ((fully naked)), 1girl, (((from behind))), (((viewer very close to ass))), cute face, sweaty,topless, (((buttlift))), spreading ass cheeks, spreading ass to expose pussy, pussy exposed, wet pussy, puffy pussy, pussy juices dripping down thighs, looking over shoulder, looking at viewer, half closed eyes, petite, hipbones, wide hips, thigh gap'
    },
    'doggystyle': {
      prompt: 'having doggystyle anal sex <lora:Doggystyle anal XL:1>, looking to viewer, ((fully naked)), lookingto camera, ((giant penis)), (((enormous penis))), big cock in anus, wet anus, wet pussy, ((anal)), bedroom, bed, couch'
    },
    'missionary-pov': {
      prompt: '(masterpiece, best quality, hires, high resolution:1.2), (extremely detailed, realistic, intricate details, highres), a beautiful young woman, nude, perfect teardrop breasts, erect nipples, fit petite body, (ecstasy:1.2), natural skin, missionary anal, ((creampie)), spreading legs, legs up, from above, from front, ((fully naked)), close up, (lying on bed), luxurious grey bedroom, professional decor, HDR, (morning sunlight, cinematic lighting, perfect lighting, bloom), <lora:PovMissionaryAnal-v6:.8>, giant penis, ((very large penis penetrating anus)), happy, anal sex, (((wet pussy))), (wet anus), cum'
    },
    'oral-pov': {
      prompt: 'score_9, score_8_up, score_7_up, Raw Photo, Portrait, ((fully naked)), yorha no. 2 type b, cute, angry, innocent, view from above her, laying down, on her back, sucking dick, ((blowjob, deepthroat)), big eyes, face close-up, dynamic angle, (photo realistic:1.4), realistic skin:1.4, fashion photography, sharp, analog film grain, hyperdetailed:1.15, face closeup'
    },
    'cumshot': {
      prompt: 'pov, looking at viewer, blowjob, ((fully naked)), <lora:FellatioJapan_Studio_Ripper_POV_Cumshot-000005:0.8>fjpovcumshot, 1girl, (cum), cumshot, penis on tongue, mouth open, tongue out, thick cum on tongue, ejaculation from penis, (cum on face), black background, <lora:sdxl_lightning_8step_lora:1>'
    },
    'tongue-out': {
      prompt: 'score_9, score_8_up, score_7_up, photo, creative angle, POV, wide angle, 1girl, ((fully naked)), live action foto, cute girl, wet and sweaty, detailed face, cute face, petite body, HD32K, incredibly detailed, arched back, (naughty, teasing expression), ((toned, fit, biceps), villa, girl sitting on her knees, looking up, eyes half-closed, eye contact, mouth open, tongue out, waiting for a cumshot, cum in mouth, cum on face, (((cumshotinmouth))), (cum), blowjob, very long penis, (huge penis), cum on tongue, penis on tongue, cum on body'
    },
    'blowjob': {
      prompt: ' blowjob, (b4llsd33p, holding down), deepthroat, ((fully naked)), facefucking, throat bulge, (retching:1.2), shoulders together, hunched over, drooling saliva, spit bubble, saliva bubble, monster cock, (((huge cock))), massive cock, absurdly large cock, (long cock), female focus, faceless male, looking at you, wide view, full body view, happy, (looking at viewer), face close-up'
    },
    'shower': {
      prompt: 'in a shower, shower scene, ((fully naked)), wet body, water droplets, bathroom tiles, steam, wet hair, soap suds, sensual pose, looking at viewer, standing in shower, water streaming down body, modern bathroom'
    },
    'sucking': {
      prompt: 'oral sex, sucking, ((fully naked)), mouth open, tongue visible, intimate pose, close-up facial expression, eyes looking up, lips wrapped around, saliva, wet mouth, passionate expression, kneeling position'
    },
    // Male poses
    'shower-male': {
      prompt: 'a handsome man, strong male in a shower, shower scene, ((fully naked)), wet body, water droplets, bathroom tiles, steam, wet hair, soap suds, sensual pose, looking at viewer, standing in shower, water streaming down body, modern bathroom, huge cock, fat penis, large penis, xxl penis'
    },
    'standing-front-male': {
      prompt: 'a handsome man, strong male, standing pose, front view, huge cock, fat penis, large penis, xxl penis'
    },
    'from behind-male': {
      prompt: 'from behind, back view, rear view, standing, male body, muscular, huge cock, fat penis, large penis, xxl penis'
    },
    'spread legs-male': {
      prompt: 'spread legs, sitting, legs apart, male body, muscular, huge cock, fat penis, large penis, xxl penis'
    }
  }

  // DEV: Update pose prompt when pose changes
  const handlePoseChange = (newPose: string) => {
    const poseConfig = poseConfigs[newPose]
    if (poseConfig && poseConfig.prompt) {
      onEditablePromptsChange({
        ...editablePrompts,
        posePrompt: poseConfig.prompt
      })
    }
    onOptionsChange({ ...advancedOptions, pose: newPose as AdvancedOptions['pose'] })
  }

  const handleGenderChange = (gender: 'female' | 'male') => {
    const newPoses = gender === 'male' ? malePoseIcons : femalePoseIcons;
    const firstValidPose = Object.keys(newPoses)[0] as AdvancedOptions['pose'];
    
    // Update the pose prompt when gender changes
    const poseConfig = poseConfigs[firstValidPose]
    if (poseConfig && poseConfig.prompt) {
      onEditablePromptsChange({
        ...editablePrompts,
        posePrompt: poseConfig.prompt
      })
    }
    
    onOptionsChange({ 
      ...advancedOptions, 
      gender,
      pose: firstValidPose
    });
  }

  return (
    <div className="lg:col-span-4 control-panel rounded-xl p-6 flex flex-col">
      {/* Advanced Options - NOW ALWAYS VISIBLE */}
      <div className="space-y-6 bg-gray-800/30 rounded-lg p-6 border border-gray-700/30 fade-in flex-1">
        {/* Gender */}
        <div>
          <label className="text-sm font-medium mb-3 block flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4" />
            Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['female', 'male'] as const).map(gender => (
              <button
                key={gender}
                onClick={() => handleGenderChange(gender)}
                className={`py-4 px-4 rounded-lg transition-all font-medium border ${
                  advancedOptions.gender === gender
                    ? 'bg-red-600 text-white shadow-lg border-red-500'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-slate-300 border-gray-600/50'
                }`}
              >
                {gender === 'female' ? '♀ Female' : '♂ Male'}
              </button>
            ))}
          </div>
        </div>
        
        {/* DEV: Age Slider - Changed to percentage (0-100) */}
        <div>
          <label className="text-sm font-medium mb-3 block flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4" />
            Age: <span className="text-red-400 font-bold">{advancedOptions.age}%</span>
          </label>
          <div className="slider-container">
            <div
              className="slider-fill bg-gradient-to-r from-red-500 to-red-700"
              style={{ width: `${advancedOptions.age}%` }}
            />
            <div
              className="slider-thumb"
              style={{ left: `${advancedOptions.age}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={advancedOptions.age}
              onChange={e => onOptionsChange({ ...advancedOptions, age: parseInt(e.target.value) })}
              className="slider-input"
            />
          </div>
        </div>
        
        {/* Body Type Slider */}
        <div>
          <label className="text-sm font-medium mb-3 block text-slate-300">Body Type</label>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🏃‍♀️</span>
            <div className="flex-1 slider-container">
              <div
                className="slider-fill bg-gradient-to-r from-red-500 to-red-700"
                style={{ width: `${advancedOptions.bodyType}%` }}
              />
              <div
                className="slider-thumb"
                style={{ left: `${advancedOptions.bodyType}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={advancedOptions.bodyType}
                onChange={e => onOptionsChange({ ...advancedOptions, bodyType: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>
            <span className="text-2xl">🍔</span>
          </div>
        </div>
        
        {/* Breast Size Slider (only for female) */}
        {advancedOptions.gender === 'female' && (
          <div>
            <label className="text-sm font-medium mb-3 block text-slate-300">Breast Size</label>
            <div className="flex items-center gap-4">
              <span className="text-2xl">🍊</span>
              <div className="flex-1 slider-container">
                <div
                  className="slider-fill bg-gradient-to-r from-red-500 to-red-700"
                  style={{ width: `${advancedOptions.breastSize}%` }}
                />
                <div
                  className="slider-thumb"
                  style={{ left: `${advancedOptions.breastSize}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={advancedOptions.breastSize}
                  onChange={e => onOptionsChange({ ...advancedOptions, breastSize: parseInt(e.target.value) })}
                  className="slider-input"
                />
              </div>
              <span className="text-2xl">🍉</span>
            </div>
          </div>
        )}
        
        {/* Pose Selector - Gender-specific */}
        <div>
          <label className="text-sm font-medium mb-3 block text-slate-300">
            Pose
            {!isCurrentPoseValid && (
              <span className="text-red-400 text-xs ml-2">(Pose reset for {advancedOptions.gender})</span>
            )}
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto modern-scrollbar">
            {validPoses.map(pose => (
              <button
                key={pose}
                onClick={() => handlePoseChange(pose)}
                className={`py-3 px-2 rounded-lg text-xs transition-all flex flex-col items-center font-medium border ${
                  advancedOptions.pose === pose
                    ? 'bg-red-600 text-white shadow-lg border-red-500'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-slate-300 border-gray-600/50'
                }`}
              >
                <span className="text-lg mb-1">{currentPoseIcons[pose]}</span>
                <span className="text-xs text-center leading-tight">{currentPoseLabels[pose]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Skin Tone Slider */}
        <div>
          <label className="text-sm font-medium mb-3 block text-slate-300">Skin Tone</label>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🍫</span>
            <div className="flex-1 slider-container">
              <div
                className="slider-fill bg-gradient-to-r from-red-500 to-red-700"
                style={{ width: `${advancedOptions.skinTone}%` }}
              />
              <div
                className="slider-thumb"
                style={{ left: `${advancedOptions.skinTone}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={advancedOptions.skinTone}
                onChange={e => onOptionsChange({ ...advancedOptions, skinTone: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>
            <span className="text-2xl">🥛</span>
          </div>
        </div>

        {/* Wetness Slider */}
        <div>
          <label className="text-sm font-medium mb-3 block flex items-center gap-2 text-slate-300">
            <Droplets className="w-4 h-4" />
            Wetness: <span className="text-red-400 font-bold">{advancedOptions.wetness}%</span>
          </label>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🟤</span>
            <div className="flex-1 slider-container">
              <div
                className="slider-fill bg-gradient-to-r from-red-500 to-red-700"
                style={{ width: `${advancedOptions.wetness}%` }}
              />
              <div
                className="slider-thumb"
                style={{ left: `${advancedOptions.wetness}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={advancedOptions.wetness}
                onChange={e => onOptionsChange({ ...advancedOptions, wetness: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>
            <span className="text-2xl">💧</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Controls wet and oily appearance</p>
        </div>

        {/* Face Reference Checkbox */}
        <div className="border-t border-gray-600/30 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <input
                type="checkbox"
                id="useFaceReference"
                checked={useFaceReference}
                onChange={(e) => onUseFaceReferenceChange(e.target.checked)}
                className="sr-only"
              />
              <label 
                htmlFor="useFaceReference" 
                className={`
                  flex items-center justify-center w-5 h-5 rounded-md border-2 cursor-pointer transition-all duration-200 ease-in-out
                  ${useFaceReference 
                    ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/25' 
                    : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:bg-gray-600/50'
                  }
                `}
              >
                {useFaceReference && (
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                )}
              </label>
            </div>
            <label 
              htmlFor="useFaceReference" 
              className="text-sm font-medium flex items-center gap-2 text-slate-300 cursor-pointer hover:text-slate-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Use face reference
            </label>
          </div>
          
          {useFaceReference && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-center text-slate-200">Upload Face Reference</h3>
                <div 
                  className="relative"
                  onMouseEnter={() => setShowHelp(true)}
                  onMouseLeave={() => setShowHelp(false)}
                >
                  <HelpCircle className="w-5 h-5 text-slate-400 cursor-help hover:text-slate-300 transition-colors" />
                  {showHelp && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl border border-gray-600 z-50">
                      <div className="space-y-2">
                        <p className="font-semibold text-red-400">📸 Image Quality Tips:</p>
                        <ul className="space-y-1 text-slate-300">
                          <li>• Use high-quality, clear face images</li>
                          <li>• Ensure good lighting and visibility</li>
                          <li>• Avoid images with multiple people</li>
                          <li>• Try different pictures for better results</li>
                          <li>• Output quality depends on input quality</li>
                        </ul>
                        <p className="font-semibold text-red-400 mt-3">⚠️ Important:</p>
                        <p className="text-red-300">It&apos;s forbidden to use someone else&apos;s photo without their explicit consent.</p>
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div
                onClick={handleUploadClick}
                className={`w-full aspect-square rounded-xl border-3 border-dashed border-gray-500/60 flex items-center justify-center cursor-pointer relative overflow-hidden hover:border-red-400/70 upload-container ${preview ? 'has-image subtle-halo' : ''}`}
                style={{ maxWidth: '180px', maxHeight: '180px', margin: '0 auto' }}
              >
                {preview ? (
                  <>
                    <div className="image-container">
                      <Image 
                        src={preview} 
                        alt="Uploaded" 
                        className="uploaded-preview-image" 
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="180px"
                      />
                    </div>
                    <button
                      onClick={handleClearImage}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg z-10"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 p-6">
                    <Upload className="w-10 h-10 mb-2" />
                    <span className="text-sm font-medium">Click to Upload</span>
                    <span className="text-xs text-slate-500 mt-1">JPG, PNG, WebP</span>
                    <span className="text-xs text-slate-500">Max 10MB</span>
                  </div>
                )}
                
                <input
                  key={uploadKey}
                  id="upload-input-main"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          )}
        </div>

        {/* DEV: Editable Prompts Section */}
        <div className="border-t border-gray-600/30 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Edit3 className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">DEV: Editable Prompts</h3>
          </div>
          
          <div className="space-y-4">
            {/* Base Prompt */}
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">
                Base Prompt
              </label>
              <textarea
                value={editablePrompts.basePrompt}
                onChange={(e) => onEditablePromptsChange({
                  ...editablePrompts,
                  basePrompt: e.target.value
                })}
                className="w-full h-20 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white resize-none focus:border-red-500 focus:outline-none"
                placeholder="Enter base prompt..."
              />
            </div>

            {/* Pose/LoRA Prompt */}
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">
                Pose/LoRA Prompt
              </label>
              <textarea
                value={editablePrompts.posePrompt}
                onChange={(e) => onEditablePromptsChange({
                  ...editablePrompts,
                  posePrompt: e.target.value
                })}
                className="w-full h-20 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white resize-none focus:border-red-500 focus:outline-none"
                placeholder="Enter pose/LoRA specific prompt..."
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">
                Negative Prompt
              </label>
              <textarea
                value={editablePrompts.negativePrompt}
                onChange={(e) => onEditablePromptsChange({
                  ...editablePrompts,
                  negativePrompt: e.target.value
                })}
                className="w-full h-20 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white resize-none focus:border-red-500 focus:outline-none"
                placeholder="Enter negative prompt..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};