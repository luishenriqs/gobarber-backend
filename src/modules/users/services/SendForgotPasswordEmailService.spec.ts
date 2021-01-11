import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeMailProvider,
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste do service 'SendForgotPasswordEmailService'; */
  it('should be able to recover the password using the email', async () => {
    // O 'spyOn' retorna informações do método espionado;
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });
    // Testando o 'SendForgotPasswordEmailService';
    await sendForgotPasswordEmail.execute({
      email: 'jonhdoe@email.com',
    });

    /* Espera a função tenha sido chamada; */
    expect(sendMail).toHaveBeenCalled();
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da condição de não recuperar a senha de um usuário não existênte; */
  it('should not be able to recover the password of a non-existent user', async () => {
    /* Espera rejeitar a recuperação de senha; */
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'jonhdoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Teste da exigência de gerar um token de usuário; */
  it('should generate a forgot password token', async () => {
    // O 'spyOn' retorna informações do método espionado;
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });
    // Testando o 'SendForgotPasswordEmailService';
    await sendForgotPasswordEmail.execute({
      email: 'jonhdoe@email.com',
    });

    /* Espera chamar o método 'generate' do "fakeUserTokensRepository" passando
    o 'user.id' como parâmetro; */
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
  /* ************************************************************************ */
});
