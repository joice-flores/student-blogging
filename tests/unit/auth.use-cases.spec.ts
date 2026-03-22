import { AuthRegister, Login, Logout } from '@application/auth';
import { HashProvider } from '@application/providers/hash-provider';
import { User } from '@domain/user/entities/user';
import { IUserRepository } from '@domain/user/repositories/user.repository';
import { Email } from '@domain/user/value-objects/email';
import { Argon2HashProvider } from '@infrastructure/providers/argon2-hash-provider';
import { JwtTokenProvider } from '@infrastructure/providers/jwt-token-provider';

describe('Auth Use Cases', () => {
  describe('AuthRegister', () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let hashProvider: jest.Mocked<HashProvider>;

    beforeEach(() => {
      userRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
      };

      hashProvider = {
        hash: jest.fn(),
        compare: jest.fn()
      };
    });

    it('should register a user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      hashProvider.hash.mockResolvedValue('hashed-password');

      const useCase = new AuthRegister(userRepository, hashProvider);

      const result = await useCase.execute({
        name: '  John Doe  ',
        email: 'JOHN@EXAMPLE.COM',
        password: 'secret123'
      });

      expect(result.id).toEqual(expect.any(String));
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(hashProvider.hash).toHaveBeenCalledWith('secret123');
      expect(userRepository.save).toHaveBeenCalledTimes(1);

      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.password).toBe('hashed-password');
      expect(savedUser.name).toBe('John Doe');
      expect(savedUser.email.getValue()).toBe('john@example.com');
    });

    it('should throw when email is already in use', async () => {
      const existingUser = User.create({
        name: 'Existing',
        email: Email.create('existing@example.com'),
        password: 'hashed-password'
      });

      userRepository.findByEmail.mockResolvedValue(existingUser);

      const useCase = new AuthRegister(userRepository, hashProvider);

      await expect(
        useCase.execute({
          name: 'John',
          email: 'john@example.com',
          password: 'secret123'
        })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(hashProvider.hash).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when email is invalid', async () => {
      const useCase = new AuthRegister(userRepository, hashProvider);

      await expect(
        useCase.execute({
          name: 'John',
          email: 'invalid-email',
          password: 'secret123'
        })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let hashProvider: jest.Mocked<Argon2HashProvider>;
    let tokenProvider: JwtTokenProvider;

    beforeEach(() => {
      userRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
      };

      hashProvider = {
        hash: jest.fn(),
        compare: jest.fn()
      } as jest.Mocked<Argon2HashProvider>;

      tokenProvider = new JwtTokenProvider('test-secret');
    });

    it('should login successfully with valid credentials', async () => {
      const user = User.create({
        name: 'Jane',
        email: Email.create('jane@example.com'),
        password: 'hashed-password'
      });

      userRepository.findByEmail.mockResolvedValue(user);
      hashProvider.compare.mockResolvedValue(true);
      const signSpy = jest
        .spyOn(tokenProvider, 'sign')
        .mockReturnValue('access-token');

      const useCase = new Login(userRepository, hashProvider, tokenProvider);

      const result = await useCase.execute({
        email: 'jane@example.com',
        password: 'plain-pass'
      });

      expect(hashProvider.compare).toHaveBeenCalledWith(
        'plain-pass',
        'hashed-password'
      );
      expect(signSpy).toHaveBeenCalledWith({
        sub: user.id.getValue(),
        email: user.email.getValue()
      });
      expect(result).toEqual({
        accessToken: 'access-token',
        user: {
          id: user.id.getValue(),
          name: user.name,
          email: user.email.getValue()
        }
      });
    });

    it('should throw when email is invalid', async () => {
      const useCase = new Login(userRepository, hashProvider, tokenProvider);

      await expect(
        useCase.execute({ email: 'invalid-email', password: 'secret123' })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw when user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const useCase = new Login(userRepository, hashProvider, tokenProvider);

      const signSpy = jest.spyOn(tokenProvider, 'sign');

      await expect(
        useCase.execute({ email: 'jane@example.com', password: 'plain-pass' })
      ).rejects.toMatchObject({ statusCode: 401 });

      expect(hashProvider.compare).not.toHaveBeenCalled();
      expect(signSpy).not.toHaveBeenCalled();
    });

    it('should throw when password does not match', async () => {
      const user = User.create({
        name: 'Jane',
        email: Email.create('jane@example.com'),
        password: 'hashed-password'
      });

      userRepository.findByEmail.mockResolvedValue(user);
      hashProvider.compare.mockResolvedValue(false);

      const useCase = new Login(userRepository, hashProvider, tokenProvider);

      const signSpy = jest.spyOn(tokenProvider, 'sign');

      await expect(
        useCase.execute({ email: 'jane@example.com', password: 'plain-pass' })
      ).rejects.toMatchObject({ statusCode: 401 });

      expect(signSpy).not.toHaveBeenCalled();
    });
  });

  describe('Logout', () => {
    it('should complete without errors', () => {
      const useCase = new Logout();

      const result = useCase.execute();

      expect(result).toBeUndefined();
    });
  });
});
