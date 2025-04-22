import * as bcrypt from 'bcrypt';

//HASHING PASSWORD
export async function encodePassword(password: string): Promise<string> {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

//Compare or verify
export async function verifyPassword(password: string, encryptedPassword: string): Promise<boolean> {
  const comparedPassword = await bcrypt.compare(password, encryptedPassword);
  return comparedPassword;
}
