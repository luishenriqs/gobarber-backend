import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    // Recupera o id do usuario logado que foi setado pelo Midleware;
    const user_id = request.user.id;

    // Pega os demais dados para criar appointments;
    const { provider_id, date } = request.body;

    const CreateAppointment = container.resolve(CreateAppointmentService);

    // Cria um novo appointment;
    const appointment = await CreateAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    // Retorna o appointment criado;
    return response.json(appointment);
  }
}
