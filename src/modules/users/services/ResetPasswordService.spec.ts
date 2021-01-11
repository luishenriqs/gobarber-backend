import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordlService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordlService;

describe('ResetPasswordService', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordlService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste do service 'ResetPasswordService'; */
  it('should be able to reset password', async () => {
    // Crio um novo user;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    // Com o 'user.id' capturo o 'token';
    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    // Teste do 'resetPassword' passando os parâmetros '(novo password)' e 'token';
    await resetPassword.execute({
      password: '789789',
      token,
    });

    // Usando o 'user.id' busco dentro do repositório o usuário que teve a senha alterada;
    const updatedUser = await fakeUsersRepository.findById(user.id);

    /* Espectativa de que a senha esteja atualizada e que o método
    'generateHash' tenha sido chamado; */
    expect(updatedUser?.password).toBe('789789');
    expect(generateHash).toHaveBeenCalledWith('789789');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não resetar senha com token inexistente; */
  it('should be able to reset password with a non-existing token', async () => {
    // Espectativa de que a instrução seja rejeitada e instâncie um erro;
    await expect(
      resetPassword.execute({
        password: '789789',
        token: 'non-existing token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não resetar senha com usuário inexistente; */
  it('should be able to reset password with a non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    // Espectativa de que a instrução seja rejeitada e instâncie um erro;
    await expect(
      resetPassword.execute({
        password: '789789',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não resetar senha após duas horas do pedido; */
  it('should not be able to reset password after more than 2 hours', async () => {
    // Crio um novo user;
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    /* O 'jest.spyOn' vai monitorar a função global 'Date now'. Então quando ela
    for chamada o 'mockImplementationOnce' irá impedir o seu funcionamento
    e retornar uma função personalizada, neste caso a 'new Date' com acréscimo
    de 3 horas;  */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    // Espectativa de que a instrução seja rejeitada e instâncie um erro;
    await expect(
      resetPassword.execute({
        password: '789789',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
