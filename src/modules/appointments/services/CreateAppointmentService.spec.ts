import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Testa a criação de appointments pelo service CreateAppointmentService */
  it('should be able to create a new appointment', async () => {
    // Seta uma data atual fixa;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    // Cria um novo 'appointment' em uma data futura fixa;
    const appointment = await createAppointment.execute({
      date: new Date(2021, 4, 10, 13),
      user_id: '9898989898',
      provider_id: '123123123',
    });

    /* Espera que o 'appointment' tenha a prop 'id' e que a prop 'provider_id'
    seja igual a passada como segundo parâmetro; */
    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe('123123123');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Testa a condição de não criar dois agendamentos na mesma data e horário; */
  it('should not be able to create two appointments in the same time', async () => {
    const appointmentDate = new Date(2021, 4, 10, 11);

    // Cria o primeiro appointment;
    await createAppointment.execute({
      date: appointmentDate,
      user_id: '9898989898',
      provider_id: '123123123',
    });
    // Espera rejeitar a criação do segundo appointment na mesma data;
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '9898989898',
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  // Testa a condição de não criar appointments em uma data passada;
  it('should  not be able to create an appointment on a past date', async () => {
    // Seta uma data atual fixa;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    // Espera rejeitar um novo 'appointment' criado em uma data passada;
    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 11),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Testa a condição do user não criar um appointment com ele mesmo;
  'user_id' !== 'provider_id'*/
  it('should  not be able to create an appointment with same user as provider', async () => {
    // Seta uma data atual fixa;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });
    // Espera rejeitar um novo 'appointment';
    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 13),
        user_id: 'user-id',
        provider_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  // Testa a condição de criar appointments apenas na faixa das 8hrs as 17hrs;
  it('should  not be able to create an appointment before 8am and after 5pm', async () => {
    // Seta uma data atual fixa;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    // Espera rejeitar um novo 'appointment' criado antes do primeiro horário;
    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 11, 7),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    // Espera rejeitar um novo 'appointment' criado depois do primeiro horário;
    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 11, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
