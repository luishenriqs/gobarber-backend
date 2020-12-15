import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdatUserAvatarService';

describe('UpdateUserAvatar', () => {
  /* ************************************************************************ */
  /* Teste do service 'UpdateUserAvatar'; */
  it('should be able to update user.avatar', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    // Testando o 'UpdateUserAvatar';
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

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
    expect(user.avatar).toBe('avatar.jpg');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não atualizar avatar de usuário inexistênte; */
  it('should not be able to update user.avatar from non existing user', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    // Testando o 'UpdateUserAvatar';
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    // Espera que seja rejeitado o service para usuário não existênte;
    expect(
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
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    // O 'spyOn' retorna o método espionado;
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    // Testando o 'UpdateUserAvatar';
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

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
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
  /* ************************************************************************ */
});
