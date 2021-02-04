import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider =  new FakeCacheProvider;
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste do service 'CreateUserService'; */
  it('should be able to create a new user', async () => {
    // Primeiro cria um novo usuário;
    const user = await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    await expect(user).toHaveProperty('name');
    await expect(user).toHaveProperty('email');
    await expect(user).toHaveProperty('id');
    await expect(user.name).toBe('Jonh Doe');
    await expect(user.email).toBe('jonhdoe@email.com');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não criar usuário com email já cadastrado por outro; */
  it('should not be able to create a new user with same email from another', async () => {
    // Primeiro cria um novo usuário;
    await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Espera rejeitar a criação do usuário com email repetido;
    await expect(
      createUser.execute({
        name: 'Jonh Doe Second',
        email: 'jonhdoe@email.com',
        password: '456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
