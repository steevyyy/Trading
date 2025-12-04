export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) return { valid: false, error: 'Phone number is required' };
  if (!/^254\d{9}$/.test(phone)) return { valid: false, error: 'Enter valid Kenyan number (254XXXXXXXXX)' };
  return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) return { valid: false, error: 'Email is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: 'Enter valid email address' };
  return { valid: true };
};

export const validateLocation = (location: string): { valid: boolean; error?: string } => {
  if (!location || location.trim().length < 3) return { valid: false, error: 'Enter valid location (min 3 characters)' };
  return { valid: true };
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return '254' + cleaned;
  return cleaned;
};
