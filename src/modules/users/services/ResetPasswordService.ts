import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

/* INJEÇÃO DE DEPENDÊNCIA */
@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  /* Como parâmetro recebo o token exclusivo para o 'ResetPassword' (ele será
  usado para encontrar o 'user'), e o novo 'password' que será resetado no
  lugar do password antigo; */
  public async execute({ token, password }: IRequest): Promise<void> {
    // Com o 'token' encontro o 'usertoken';
    const userToken = await this.userTokensRepository.findByToken(token);

    // Verificação de 'token' inexistênte;
    if (!userToken) {
      throw new AppError('UserToken does not exists');
    }

    // Dentro do 'userToken' pego o 'user_id' e encontro o 'user';
    const user = await this.usersRepository.findById(userToken.user_id);

    // Verificação de usuário inexistênte;
    if (!user) {
      throw new AppError('User does not exists');
    }

    /* Verificação de validade:
      'tokenCreatedAt = Momento de criação do token';
      'compareDate' = Momento de criação do token acrescido de 2 horas;
      Se a data/momento atual for depois (isAfter) do 'compareDate' o token
      será inválido, terá expirado a sua validade; */
    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    // Substituo o valor de 'user.password' com o novo 'password';
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}
