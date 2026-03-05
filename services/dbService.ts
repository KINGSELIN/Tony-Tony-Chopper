import { UserProfile, DailyLog, MedicalDocument, UserRole } from '../types';
import { AuthLog } from './authService';

interface UserData {
  profile: UserProfile;
  logs: DailyLog[];
  documents: MedicalDocument[];
  points: number;
  loginHistory: AuthLog[];
  password?: string; // Storing password in plain text for this "temporary database" demo
}

const DB_KEY = 'chopper_v1_db';

export const getDB = (): Record<string, UserData> => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveDB = (db: Record<string, UserData>) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const getUserData = (email: string): UserData | null => {
  const db = getDB();
  return db[email] || null;
};

export const saveUserData = (email: string, data: Partial<UserData>) => {
  const db = getDB();
  const existing = db[email] || {
    profile: { id: email, name: 'User', role: UserRole.PATIENT, language: 'en' },
    logs: [],
    documents: [],
    points: 0,
    loginHistory: []
  };
  
  db[email] = { ...existing, ...data };
  saveDB(db);
};

export const registerUser = (email: string, name: string, password: string): UserData => {
  const db = getDB();
  const newUser: UserData = {
    profile: {
      id: Math.random().toString(36).substring(7),
      name,
      role: UserRole.PATIENT,
      language: 'en'
    },
    logs: [],
    documents: [],
    points: 0,
    loginHistory: [],
    password
  };
  
  db[email] = newUser;
  saveDB(db);
  return newUser;
};

export const validateLogin = (email: string, password: string): UserData | null => {
  const user = getUserData(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};
