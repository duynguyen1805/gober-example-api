import { random } from 'lodash';

export const generateRandomCodeNumber = (length: number) => {
  if (isNaN(length) || length <= 0 || length > 10)
    throw new Error('INVALID_LENGTH');
  const min = 1111111111 % 10 ** length;
  return random(min, min * 9).toString();
};

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(cleaned);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
