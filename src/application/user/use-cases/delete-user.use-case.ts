import { IUserRepository, ROLES, UserId } from '@domain/user';
import { UserError } from '@shared/errors/user/user-error';
import { DeleteUserInputDTO } from '@application/user/dto/user.dto';

export class DeleteUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInputDTO): Promise<void> {
    if (input.requesterRole !== ROLES.ADMIN) {
      throw UserError.forbidden();
    }

    const userId = UserId.create(input.id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw UserError.notFound();
    }

    await this.userRepository.delete(userId);
  }
}
