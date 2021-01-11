import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste do service 'AuthenticateUserService' */
  it('should be able to authenticate', async () => {
    // Antes de autenticar um usuário ele precisa ser criado;
    const user = await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Teste do serviço de autenticação do usuário;
    const response = await authenticateUser.execute({
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Espera que a 'response' receba a prop 'token' e 'user';
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não autenticar usuário não existênte; */
  it('should not be able to authenticate with a non existing user', async () => {
    // Espera rejeitar autenticação com usuário não existênte;
    expect(
      authenticateUser.execute({
        email: 'jonhdoe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não autenticar usuário com senha errada; */
  it('should not be able to authenticate with wrong password', async () => {
    // Antes de autenticar um usuário ele precisa ser criado;
    await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Espera rejeitar autenticação com senha incorreta;
    expect(
      authenticateUser.execute({
        email: 'jonhdoe@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
