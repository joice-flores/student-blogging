import { Email, IUserRepository, Role, User } from '@domain/user';
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
    const role = Role.default();

    const user = User.create({
      name: input.name.trim(),
      email,
      password,
      role
    });

    await this.userRepository.save(user);

    return {
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      role: user.role.getValue(),
      createdAt: user.createdAt
    };
  }
}
