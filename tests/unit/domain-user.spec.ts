import { Email, Role, ROLES, User, UserId } from '@domain/user';

describe('User domain', () => {
  it('throws when name is empty', () => {
    expect(
      () =>
        new User({
          name: ' ',
          email: Email.create('user@example.com'),
          password: 'secret1',
          role: Role.create(ROLES.STUDENT)
        })
    ).toThrow('Name is required');
  });

  it('throws when password is too short', () => {
    expect(
      () =>
        new User({
          name: 'User',
          email: Email.create('user@example.com'),
          password: '123',
          role: Role.create(ROLES.STUDENT)
        })
    ).toThrow('Password must be at least 6 characters');
  });

  it('creates a user with provided id', () => {
    const id = UserId.create('user-1');
    const email = Email.create('User@Example.com');

    const user = User.create({
      id,
      name: 'User',
      email,
      password: 'secret1',
      role: Role.create(ROLES.STUDENT)
    });

    expect(user.id.equals(id)).toBe(true);
    expect(user.email.getValue()).toBe('user@example.com');
  });

  it('reconstitutes a user with timestamps', () => {
    const id = UserId.create('user-2');
    const email = Email.create('user2@example.com');
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const updatedAt = new Date('2024-01-02T00:00:00Z');

    const user = User.reconstitute({
      id,
      name: 'User',
      email,
      password: 'secret1',
      role: Role.create(ROLES.STUDENT),
      createdAt,
      updatedAt
    });

    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
  });
});

describe('Email value object', () => {
  it('normalizes and compares values', () => {
    const email = Email.create('TEST@EXAMPLE.COM');
    const same = Email.create('test@example.com');
    const other = Email.create('other@example.com');

    expect(email.getValue()).toBe('test@example.com');
    expect(email.equals(same)).toBe(true);
    expect(email.equals(other)).toBe(false);
  });

  it('throws for invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow();
  });
});

describe('UserId value object', () => {
  it('compares and returns values', () => {
    const first = UserId.create('user-1');
    const same = UserId.create('user-1');
    const other = UserId.create('user-2');

    expect(first.getValue()).toBe('user-1');
    expect(first.equals(same)).toBe(true);
    expect(first.equals(other)).toBe(false);
  });
});

describe('Role value object', () => {
  it('creates roles and compares values', () => {
    const role = Role.create(ROLES.TEACHER);
    const same = Role.create(ROLES.TEACHER);
    const other = Role.create(ROLES.STUDENT);

    expect(role.getValue()).toBe(ROLES.TEACHER);
    expect(role.equals(same)).toBe(true);
    expect(role.equals(other)).toBe(false);
  });

  it('throws for invalid role', () => {
    expect(() => Role.create('invalid-role')).toThrow();
  });
});
