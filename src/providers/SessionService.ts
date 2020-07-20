import * as cls from 'cls-hooked';
import { SESSION_NAMESPACE } from '../shared/constants';

export class SessionService {
  static get(key: string) {
    const session = cls.getNamespace(SESSION_NAMESPACE);
    if (!session) {
      return null;
    }

    return session.get(key);
  }

  static set(key: string, value: any) {
    const session = cls.getNamespace(SESSION_NAMESPACE);
    if (!session) {
      return null;
    }

    session.set(key, value);
  }
}
