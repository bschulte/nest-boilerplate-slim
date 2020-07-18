import * as bcrypt from 'bcryptjs';

export class UtilService {
  /**
   * generate hash from password or string
   * @param {string} password
   *
   * @returns {string}
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * Takes a password as a string and validates it against the hashed password
   *
   * @param {string} password
   * @param {string} hash
   *
   * @returns {Promise<boolean>}
   */
  static validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '');
  }

  /**
   * Generate random string
   *
   * @param length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .substr(0, length);
  }
}
