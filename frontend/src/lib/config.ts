export const appConfig = {
  mosqueName: process.env.NEXT_PUBLIC_MOSQUE_NAME || 'Mosque Finance',
  mosqueNameTamil: process.env.NEXT_PUBLIC_MOSQUE_NAME_TA || 'மசூதி நிதி',
  mosqueNameArabic: process.env.NEXT_PUBLIC_MOSQUE_NAME_AR || 'مالية المسجد',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'INR',
  defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en') as 'en' | 'ta' | 'ar',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
};

export function getMosqueName(locale: 'en' | 'ta' | 'ar'): string {
  if (locale === 'ta') return appConfig.mosqueNameTamil;
  if (locale === 'ar') return appConfig.mosqueNameArabic;
  return appConfig.mosqueName;
}
