import crypto from 'crypto';

/**
 * Hash secret code (initials + birth month) for anonymous twin-star matching
 * @param initials - User's initials (e.g., "DA")
 * @param birthMonth - Birth month (e.g., "07")
 * @returns SHA256 hash
 */
export function hashSecretCode(initials: string, birthMonth: string): string {
  const normalized = `${initials.toUpperCase()}-${birthMonth.padStart(2, '0')}`;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Hash IP address for rate limiting and abuse prevention
 * @param ip - IP address
 * @returns SHA256 hash
 */
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Generate random position for star on canvas
 * @returns {x, y} coordinates between 0-100 (percentage)
 */
export function generateStarPosition(): { x: number; y: number } {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
}

/**
 * Extract IP from request (handles proxies and X-Forwarded-For)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}
