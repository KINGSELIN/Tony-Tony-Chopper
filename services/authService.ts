
export const AUTH_CONFIG = {
  TOKEN_KEY: 'chopper_jwt_token',
  REFRESH_KEY: 'chopper_refresh_token',
  EXPIRY_KEY: 'chopper_token_expiry',
  USER_EMAIL_KEY: 'chopper_user_email',
  SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  DB_VERSION: '6.0.django_sim',
};

export interface AuthLog {
  id: string;
  timestamp: string;
  device: string;
  browser: string;
  location: string;
  status: 'SUCCESS' | 'MFA_CHALLENGE' | 'REVOKED';
  ip: string;
  token_id: string;
}

export const simulateHash = (password: string) => {
  // Simulating Django's PBKDF2 hashing
  return `pbkdf2_sha256$600000$${btoa(password).substring(0, 16)}$${btoa(password).split('').reverse().join('')}`;
};

export const generateMockJWT = (userId: string) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    iat: Math.floor(Date.now() / 1000), 
    exp: Math.floor((Date.now() + AUTH_CONFIG.SESSION_TIMEOUT) / 1000),
    jti: Math.random().toString(36).substring(7),
    iss: 'chopper-django-auth-layer'
  }));
  const signature = btoa('chopper_secret_signature_v6');
  return `${header}.${payload}.${signature}`;
};

export const verifySession = () => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  const expiry = localStorage.getItem(AUTH_CONFIG.EXPIRY_KEY);
  
  if (!token || !expiry) return false;
  
  const isExpired = Date.now() > parseInt(expiry);
  if (isExpired) {
    clearSession();
    return false;
  }
  return true;
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.EXPIRY_KEY);
  localStorage.removeItem(AUTH_CONFIG.REFRESH_KEY);
  localStorage.removeItem(AUTH_CONFIG.USER_EMAIL_KEY);
};

export const getBrowserMetadata = () => {
  const ua = navigator.userAgent;
  let device = "Desktop (Workstation)";
  if (/Android/i.test(ua)) device = "Mobile (Android)";
  else if (/iPhone|iPad/i.test(ua)) device = "Mobile (iOS)";
  
  return {
    device,
    browser: navigator.vendor || 'Chromium Engine',
    os: navigator.platform
  };
};
