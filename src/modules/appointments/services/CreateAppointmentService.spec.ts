import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  /* ************************************************************************ */
  /* Testa a criação de appointments pelo service CreateAppointmentService */
  it('should be able to create a new appointment', async () => {
    // Esse é o repositório fake;
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    // Mas esse é o service verdadeiro que será testado;
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  /* Testa a condição de não criar dois agendamentos na mesma data e horário; */
  it('should not be able to create two appointments in the same time', async () => {
    // Esse é o repositório fake;
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    // Esse é o service verdadeiro que será testado;
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date();

    // Cria o primeiro appointment;
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
    });
    // Espera rejeitar a criação do segundo appointment na mesma data;
    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  /* ************************************************************************ */
});
