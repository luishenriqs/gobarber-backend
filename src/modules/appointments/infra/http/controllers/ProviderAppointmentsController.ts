import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    // Recupera o id do usuario logado que foi setado pelo Midleware;
    const provider_id = request.user.id;

    // Pega os dados do dia em que se deseja consultar;
    const { day, month, year } = request.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    // Retorna todos os agendamentos deste provider neste dia específico;
    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    // Lista com todos os appointments do provider logado no dia;
    return response.json(classToClass(appointments));
  }
}
