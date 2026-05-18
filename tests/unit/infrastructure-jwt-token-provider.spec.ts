import { ROLES } from '@domain/user';
import { JwtTokenProvider } from '@infrastructure/providers/jwt-token-provider';

describe('JwtTokenProvider', () => {
  it('signs and verifies tokens', () => {
    const provider = new JwtTokenProvider('test-secret');
    const token = provider.sign({
      sub: 'user-1',
      email: 'user@example.com',
      role: ROLES.STUDENT
    });
    const payload = provider.verify(token);

    expect(payload).toMatchObject({
      sub: 'user-1',
      email: 'user@example.com',
      role: ROLES.STUDENT
    });
  });
});
