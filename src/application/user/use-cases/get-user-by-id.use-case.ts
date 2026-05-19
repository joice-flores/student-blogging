import { IUserRepository, UserId } from '@domain/user';
import { UserError } from '@shared/errors/user/user-error';
import {
  GetUserByIdInputDTO,
  UserOutputDTO
} from '@application/user/dto/user.dto';

export class GetUserById {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserByIdInputDTO): Promise<UserOutputDTO> {
    const userId = UserId.create(input.id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw UserError.notFound();
    }

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
