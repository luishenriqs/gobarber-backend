import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    // Recupera o id do usuario logado que foi setado pelo Midleware;
    const user_id = request.user.id;

    const listProviders = container.resolve(ListProvidersService);

    // Busca todos os providers exceto o usuário logado.
    const providers = await listProviders.execute({
      user_id,
    });

    // Lista todos os providers exceto o usuário logado.
    return response.json(classToClass(providers));
  }
}
