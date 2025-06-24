// types/index.ts - Updated with face reference option
export interface AdvancedOptions {
  gender: 'female' | 'male'
  age: number
  bodyType: number
  breastSize: number
  pose: string
  skinTone: number
  wetness: number
  useFaceReference?: boolean // NEW: Face reference option
}

export interface ConsentChecks {
  terms: boolean
  age: boolean
  consent: boolean
}