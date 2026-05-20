import { IUserRepository, Role, ROLES, UserId } from '@domain/user';
import { UserError } from '@shared/errors/user/user-error';
import {
  UpdateUserInputDTO,
  UserOutputDTO
} from '@application/user/dto/user.dto';

export class UpdateUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInputDTO): Promise<UserOutputDTO> {
    const isPrivileged = input.requesterRole === ROLES.ADMIN;
    const isOwnProfile = input.requesterId === input.id;

    if (!isPrivileged && !isOwnProfile) {
      throw UserError.forbidden();
    }

    if (input.role && !isPrivileged) {
      throw UserError.forbidden();
    }

    const userId = UserId.create(input.id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw UserError.notFound();
    }

    user.update({
      name: input.name,
      role: input.role ? Role.create(input.role) : undefined
    });

    await this.userRepository.update(user);

    return {
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      role: user.role.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
