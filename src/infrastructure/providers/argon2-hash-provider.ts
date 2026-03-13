import * as argon2 from 'argon2';
import { HashProvider } from '../../application/providers/hash-provider';

export class Argon2HashProvider implements HashProvider {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, plain);
  }
}
