import { IUserRepository } from '@domain/user';
import { UserOutputDTO } from '@application/user/dto/user.dto';

export class ListUsers {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutputDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      role: user.role.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }
}
