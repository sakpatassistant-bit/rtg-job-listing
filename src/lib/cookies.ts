const COOKIE_PREFIX = 'rtg_apply_';
const COOKIE_MAX_AGE_DAYS = 30;

export function setEditTokenCookie(jobId: string, editToken: string): void {
  const name = `${COOKIE_PREFIX}${jobId}`;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(editToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getEditTokenCookie(jobId: string): string | null {
  const name = `${COOKIE_PREFIX}${jobId}`;
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name && value) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
