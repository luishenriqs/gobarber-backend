import { inject, injectable } from 'tsyringe';
import path from 'path';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

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
    const user = await this.usersRepository.findByEmail(email);
    // Validação de existência do usuário;
    if (!user) {
      throw new AppError('User does not exist');
    }

    /* Geração do token de usuário; Token exclusivo a ser usado no Reset Password; */
    const { token } = await this.userTokensRepository.generate(user.id);

    // Caminho para a busca do arquivo de template 'forgot_password.hbs';
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    // Envio do email de recuperação de senha;
    /* Com o user.email e o token é possível efetuar o 'Reset Password'; */
    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Gobarber] recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}
