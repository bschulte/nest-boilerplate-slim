import * as cls from 'cls-hooked';
import { SESSION_NAMESPACE } from '../shared/constants';

export class SessionService {
  /**
   * Get a value from the saved session for the request
   *
   * @param key
   */
  static get(key: string) {
    const session = cls.getNamespace(SESSION_NAMESPACE);
    if (!session) {
      return null;
    }

    return session.get(key);
  }

  /**
   * Set a value for the saved session for the request
   *
   * @param key
   * @param value
   */
  static set(key: string, value: any) {
    const session = cls.getNamespace(SESSION_NAMESPACE);
    if (!session) {
      return null;
    }

    session.set(key, value);
  }
}
