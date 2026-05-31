import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/** Gera hash da senha. Nunca armazenar senha em texto puro. */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Compara senha em texto com o hash armazenado. */
export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
