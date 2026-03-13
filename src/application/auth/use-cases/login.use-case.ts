import { IUserRepository } from '@domain/user/repositories/user.repository';
import { Email } from '@domain/user/value-objects/email';
import { UserError } from '@shared/errors/user/user-error';
import { Argon2HashProvider } from '@infrastructure/providers/argon2-hash-provider';
import { JwtTokenProvider } from '@infrastructure/providers/jwt-token-provider';
import { LoginInputDTO, LoginOutputDTO } from '@application/auth/dto/auth.dto';

export class Login {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: Argon2HashProvider,
    private readonly tokenProvider: JwtTokenProvider
  ) {}

  async execute(input: LoginInputDTO): Promise<LoginOutputDTO> {
    const email = Email.create(input.email);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw UserError.invalidCredentials();
    }

    const passwordMatch = await this.hashProvider.compare(
      input.password,
      user.password
    );

    if (!passwordMatch) {
      throw UserError.invalidCredentials();
    }

    const accessToken = this.tokenProvider.sign({
      sub: user.id.getValue(),
      email: user.email.getValue()
    });

    return {
      accessToken,
      user: {
        id: user.id.getValue(),
        name: user.name,
        email: user.email.getValue()
      }
    };
  }
}
