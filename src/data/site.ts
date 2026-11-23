export const APP_URL = (import.meta.env.PUBLIC_APP_URL || 'https://dashboard.ideep.ir').replace(/\/$/, '');
export const links = {
  signup: `${APP_URL}/onboarding`,
  login: `${APP_URL}/login`,
  privacy: `${APP_URL}/privacy`,
  terms: `${APP_URL}/terms`,
  privacyPdf: '/privacy.pdf',
  termsPdf: '/terms.pdf',
  support: 'mailto:support@ideep.app',
  privacyMail: 'mailto:privacy@ideep.app',
};
// Google Analytics 4 measurement ID (set PUBLIC_GA_ID to override, or to an empty string to turn it off).
export const GA_ID = import.meta.env.PUBLIC_GA_ID ?? 'G-DXMKHXZLY1';
// Generated post images live in public/images/p1.jpg ... p11.jpg (see IMAGES.md).
export const img = (n: number) => `/images/p${n}.jpg`;
