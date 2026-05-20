import {
  GetUserById,
  ListUsers,
  UpdateUser,
  DeleteUser
} from '@application/user';
import {
  Email,
  IUserRepository,
  Role,
  ROLES,
  User,
  UserId
} from '@domain/user';

describe('User Use Cases', () => {
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  });

  describe('GetUserById', () => {
    it('should return a user by id', async () => {
      const user = User.create({
        name: 'Jane Doe',
        email: Email.create('jane@example.com'),
        password: 'hashed-password',
        role: Role.create(ROLES.STUDENT)
      });

      userRepository.findById.mockResolvedValue(user);

      const useCase = new GetUserById(userRepository);
      const result = await useCase.execute({ id: user.id.getValue() });

      expect(result).toEqual({
        id: user.id.getValue(),
        name: user.name,
        email: user.email.getValue(),
        role: user.role.getValue(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      const calledId = userRepository.findById.mock.calls[0][0] as UserId;
      expect(calledId.getValue()).toBe(user.id.getValue());
    });

    it('should throw when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const useCase = new GetUserById(userRepository);

      await expect(useCase.execute({ id: 'missing-id' })).rejects.toMatchObject(
        {
          statusCode: 404
        }
      );
    });
  });

  describe('ListUsers', () => {
    it('should list users', async () => {
      const users = [
        User.create({
          name: 'User 1',
          email: Email.create('user1@example.com'),
          password: 'hashed-password',
          role: Role.create(ROLES.STUDENT)
        }),
        User.create({
          name: 'User 2',
          email: Email.create('user2@example.com'),
          password: 'hashed-password',
          role: Role.create(ROLES.TEACHER)
        })
      ];

      userRepository.findAll.mockResolvedValue(users);

      const useCase = new ListUsers(userRepository);
      const result = await useCase.execute();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(users[0].id.getValue());
      expect(result[1].id).toBe(users[1].id.getValue());
      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('UpdateUser', () => {
    it('should update a user as admin', async () => {
      const user = User.create({
        name: 'Old Name',
        email: Email.create('old@example.com'),
        password: 'hashed-password',
        role: Role.create(ROLES.STUDENT)
      });

      userRepository.findById.mockResolvedValue(user);

      const useCase = new UpdateUser(userRepository);

      const result = await useCase.execute({
        id: user.id.getValue(),
        requesterId: 'admin-id',
        requesterRole: ROLES.ADMIN,
        name: 'New Name',
        role: ROLES.TEACHER
      });

      expect(result.name).toBe('New Name');
      expect(result.role).toBe(ROLES.TEACHER);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledWith(user);
    });

    it('should reject role changes for non-admins', async () => {
      const user = User.create({
        name: 'User',
        email: Email.create('user@example.com'),
        password: 'hashed-password',
        role: Role.create(ROLES.STUDENT)
      });

      userRepository.findById.mockResolvedValue(user);

      const useCase = new UpdateUser(userRepository);

      await expect(
        useCase.execute({
          id: user.id.getValue(),
          requesterId: user.id.getValue(),
          requesterRole: ROLES.STUDENT,
          role: ROLES.ADMIN
        })
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should throw when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const useCase = new UpdateUser(userRepository);

      await expect(
        useCase.execute({
          id: 'missing-id',
          requesterId: 'admin-id',
          requesterRole: ROLES.ADMIN,
          name: 'New Name'
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should forbid non-admin updates to other users', async () => {
      const user = User.create({
        name: 'User',
        email: Email.create('user@example.com'),
        password: 'hashed-password',
        role: Role.create(ROLES.STUDENT)
      });

      userRepository.findById.mockResolvedValue(user);

      const useCase = new UpdateUser(userRepository);

      await expect(
        useCase.execute({
          id: user.id.getValue(),
          requesterId: 'other-user',
          requesterRole: ROLES.STUDENT,
          name: 'New Name'
        })
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(userRepository.findById).not.toHaveBeenCalled();
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('DeleteUser', () => {
    it('should delete a user as admin', async () => {
      const user = User.create({
        name: 'User',
        email: Email.create('user@example.com'),
        password: 'hashed-password',
        role: Role.create(ROLES.STUDENT)
      });

      userRepository.findById.mockResolvedValue(user);

      const useCase = new DeleteUser(userRepository);

      await useCase.execute({
        id: user.id.getValue(),
        requesterId: 'admin-id',
        requesterRole: ROLES.ADMIN
      });

      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      const calledId = userRepository.delete.mock.calls[0][0] as UserId;
      expect(calledId.getValue()).toBe(user.id.getValue());
    });

    it('should forbid deletes for non-admins', async () => {
      const useCase = new DeleteUser(userRepository);

      await expect(
        useCase.execute({
          id: 'any-id',
          requesterId: 'user-id',
          requesterRole: ROLES.STUDENT
        })
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(userRepository.findById).not.toHaveBeenCalled();
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const useCase = new DeleteUser(userRepository);

      await expect(
        useCase.execute({
          id: 'missing-id',
          requesterId: 'admin-id',
          requesterRole: ROLES.ADMIN
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
