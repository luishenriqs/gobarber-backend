import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdatUserAvatarService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste do service 'UpdateUserAvatar'; */
  it('should be able to update user.avatar', async () => {
    // Primeiro cria um novo usuário;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Depois executa o service 'UpdateUserAvatar';
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    // Espera que o user.avatar seja o mesmo passado como parâmetro;
    await expect(user.avatar).toBe('avatar.jpg');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não atualizar avatar de usuário inexistênte; */
  it('should not be able to update user.avatar from non existing user', async () => {
    // Espera que seja rejeitado o service para usuário não existênte;
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existent-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de deletar o avatar se existir previamente; */
  it('should be able to delete user.avatar if it already exists', async () => {
    // O 'spyOn' retorna informações do método espionado;
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    // Primeiro cria um novo usuário;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Depois executa o service 'UpdateUserAvatar' fornecendo um avatar;
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    /* Por último executa o service 'UpdateUserAvatar' novamente fornecenco um
    novo avatar; */
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    /* Espera a função tenha sido chamada tendo como parâmetro o primeiro avatar
    e que o 'user.avatar' esteja atualizado; */
    await expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    await expect(user.avatar).toBe('avatar2.jpg');
  });
  /* ************************************************************************ */
});
