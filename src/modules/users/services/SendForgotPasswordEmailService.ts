import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

/* INJEÇÃO DE DEPENDÊNCIA */
@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    // Validação de existência do usuário;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exist');
    }

    // Geração do token de usuário;
    const { token } = await this.userTokensRepository.generate(user.id);

    // Envio do email de recuperação de senha;
    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Gobarber] recuperação de senha',
      templateData: {
        template: 'Olá, {{name}}: {{token}}',
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}
