import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Testa a criação de appointments pelo service CreateAppointmentService */
  it('should be able to create a new appointment', async () => {
    // Criando um novo 'appointment';
    const appointment = await createAppointment.execute({
      date: new Date(),
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
    const appointmentDate = new Date();

    // Cria o primeiro appointment;
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
    });
    // Espera rejeitar a criação do segundo appointment na mesma data;
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
