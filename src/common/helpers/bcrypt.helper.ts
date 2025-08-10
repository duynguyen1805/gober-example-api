import * as bcrypt from 'bcrypt';

export const encrypt = (value: string): string => {
  if (!value) return value;
  return bcrypt.hashSync(value, 10);
};

export const decrypt = (value: string): string => {
  if (!value) return value;
  return value;
}; 