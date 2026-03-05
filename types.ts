
export enum UserRole {
  PATIENT = 'PATIENT',
  CAREGIVER = 'CAREGIVER'
}

export type LanguageCode = 'en' | 'ta' | 'ml' | 'kn' | 'te';

export type TriagePriority = 'URGENT' | 'HIGH' | 'ROUTINE';
export type AiStatus = 'AI-POSITIVE' | 'AI-NEGATIVE' | 'SCANNING' | 'PENDING';
export type Department = 'MSK' | 'NEURO' | 'CARDIO' | 'GENERAL';

export interface MedicalDocument {
  id: string;
  name: string;
  date: string;
  type: string;
  fileSize: string;
  data?: string; // base64 for demo
  triage: TriagePriority;
  aiStatus: AiStatus;
  dept: Department;
  insight?: ReportInsight;
}

export interface Prescription {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  age?: number;
  gender?: string;
  height?: number; // in cm
  weight?: number; // in kg
  language: LanguageCode;
  profilePic?: string;
  documents?: MedicalDocument[];
  prescriptions?: Prescription[];
}

export interface MedicationLog {
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface DailyLog {
  id: string;
  date: string;
  mood: number; // 1-5
  pain: number; // 0-10
  medsTaken: boolean;
  medications?: MedicationLog[];
  calciumIntake: number; // mg
  vitaminD: number; // IU
  proteinIntake: number; // grams
  carbsIntake: number; // grams
  fatIntake: number; // grams
  magnesium: number; // mg
  vitaminK2: number; // mcg
  stressLevel: number; // 1-10
  mindfulnessMinutes: number;
  activityMinutes: number;
  steps: number;
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  sunlightMinutes: number;
  waterGlasses: number;
  caffeineCups: number;
  routineItems?: string[]; // New: Track specific prescribed food items logged
  notes?: string;
  recommendations?: { icon: any; text: string; color: string; bg: string; type: 'diet' | 'exercise' }[];
}

export interface BoneRegion {
  name: string;
  severity: 'normal' | 'low' | 'critical';
  confidence: number;
}

export interface ReportInsight {
  date: string;
  type: string; // DEXA, Lab
  tScore?: number;
  summary: string;
  recommendations: string[];
  solutions?: string[]; // New: specific clinical solutions
  regions?: BoneRegion[];
}

export interface RiskPrediction {
  score: number; // 0-100
  label: 'Low' | 'Moderate' | 'High';
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    value: string;
  }[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface GameLevel {
  id: number;
  scrambled: string;
  answer: string;
  hint: string;
  calciumMg: number;
  funFact: string;
}

export interface WearableStatus {
  isConnected: boolean;
  battery: number;
  lastSync: Date;
  equilibriumScore: number;
  skeletalLoading: number; // 0-100% target
}
