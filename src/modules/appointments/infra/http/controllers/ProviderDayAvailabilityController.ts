import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

/* ********************[ROTA LIST DAY AVAILABILITY]************************** */
export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    /* Lista todos os horários de um provider no dia específico e suas respectivas
    disponibilidades; Horário disponível se: vago e em momento futuro;*/
    return response.json(availability);
  }
}
/* ************************************************************************** */
