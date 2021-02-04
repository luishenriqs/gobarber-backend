import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

/* INJEÇÃO DE DEPENDÊNCIA; */
@injectable()
class UpdateProfile {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('user not found.');
    }

    /* Procura no repositório se o email enviado já está em uso; */
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    /* Caso o email enviado já esteja em uso e não seja o do próprio solicitante
    da atualização do perfil será disparado um erro; */
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('E-mail alredy in use.');
    }

    /* Caso a requisição de atualização passe nos testes de verificação acima
    os valores de "name" e "email" serão alterados; */
    user.name = name;
    user.email = email;

    // Verificação se foi informado senha nova e senha antiga;
    if (password && !old_password) {
      throw new AppError('You need to informe your old password.');
    }

    // Verificação se senha antiga informada confere com a do registro do usuário;
    if (user.password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
    }

    // Caso passe em todas as verificações a senha do usuário será atualizada;
    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfile;
