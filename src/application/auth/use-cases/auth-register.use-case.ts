import { User } from '@domain/user/entities/user';
import { IUserRepository } from '@domain/user/repositories/user.repository';
import { Email } from '@domain/user/value-objects/email';
import { UserError } from '@shared/errors/user/user-error';
import { HashProvider } from '@application/providers/hash-provider';
import {
  RegisterInputDTO,
  RegisterOutputDTO
} from '@application/auth/dto/auth.dto';

export class AuthRegister {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async execute(input: RegisterInputDTO): Promise<RegisterOutputDTO> {
    const email = Email.create(input.email);
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw UserError.emailAlreadyInUse();
    }

    const password = await this.hashProvider.hash(input.password);

    const user = User.create({
      name: input.name.trim(),
      email,
      password,
      role: input.role
    });

    await this.userRepository.save(user);

    return {
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
