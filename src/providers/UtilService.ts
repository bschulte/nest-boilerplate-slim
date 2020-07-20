import * as bcrypt from 'bcryptjs';

export class UtilService {
  /**
   * generate hash from password or string
   *
   * @param password
   *
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * Takes a password as a string and validates it against the hashed password
   *
   * @param password
   * @param hash
   *
   */
  static validateHash(password: string, hash: string) {
    return bcrypt.compareSync(password, hash || '');
  }

  /**
   * Generate random string
   *
   * @param length
   */
  static generateRandomString(length: number): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
