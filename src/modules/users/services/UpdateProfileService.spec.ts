import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste do service 'UpdateProfile'; */
  it('should be able to update the profile', async () => {
    // Primeiro cria um novo usuário;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Depois executa o service 'UpdateProfile';
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Tree',
      email: 'jonhtree@example.com',
    });

    /* Espera-se que o "updatedUser.name" e "updatedUser.email" sejam iguais aos
    passados como parâmetro; */
    await expect(updatedUser.name).toBe('Jonh Tree');
    await expect(updatedUser.email).toBe('jonhtree@example.com');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Verifica a condição de não alterar email para um endereço já existente; */
  it('should not be able to change to another user email', async () => {
    // Cria um primeiro usuário;
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Depois cria o usuário que tentará alterar seu email;
    const user = await fakeUsersRepository.create({
      name: 'Test Name',
      email: 'testname@email.com',
      password: '789789',
    });

    /* Espera-se que o serviço seja rejeitado por tentar alterar para um
    email já existente; */
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Test Name',
        email: 'jonhdoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da atualização da senha; */
  it('should be able to update the password', async () => {
    // Primeiro cria um novo usuário;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Depois executa o service 'UpdateProfile';
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Tree',
      email: 'jonhtree@example.com',
      old_password: '123456',
      password: '123123',
    });

    /* Espera-se que o "name", o "email" e a "password" do "updatedUser" 
    sejam iguais aos passados como parâmetro; */
    await expect(updatedUser.name).toBe('Jonh Tree');
    await expect(updatedUser.email).toBe('jonhtree@example.com');
    await expect(updatedUser.password).toBe('123123');
  });
  /* ************************************************************************ */

    /* ************************************************************************ */
  /* Teste da condição de não atualizar senha sem o envio de senha antiga; */
  it('should not be able to update the password without old_password', async () => {
    // Primeiro cria um novo usuário;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Depois executa o service 'UpdateProfile';
    const updatedUser = await 

    /* Espera-se que a requisição seja rejeitada por não apresentar "old_password"; */
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Tree',
        email: 'jonhtree@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

      /* ************************************************************************ */
  /* Teste da condição de não atualizar senha com senha antiga incorreta; */
  it('should not be able to update the password with wrong old_password', async () => {
    // Primeiro cria um novo usuário;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    /* Espera-se que a requisição seja rejeitada por não apresentar
    "old_password" correta; */
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Tree',
        email: 'jonhtree@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
