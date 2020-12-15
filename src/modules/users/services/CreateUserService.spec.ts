import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  /* ************************************************************************ */
  /* Teste do service 'CreateUserService'; */
  it('should be able to create a new user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    // Testando o 'CreateUserService';
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Jonh Doe');
    expect(user.email).toBe('jonhdoe@email.com');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não criar usuário com email já cadastrado por outro; */
  it('should not be able to create a new user with same email from another', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    // Testando o 'CreateUserService';
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Espera rejeitar a criação do usuário com email repetido;
    expect(
      createUser.execute({
        name: 'Jonh Doe Second',
        email: 'jonhdoe@email.com',
        password: '456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
