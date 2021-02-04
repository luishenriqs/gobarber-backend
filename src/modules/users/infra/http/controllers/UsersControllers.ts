import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/users/services/CreateUserService';

/* **********************[ROTA CREATE USER]********************************** */
export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    // Instanciando sevice;
    const createUser =container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

     // Retornando usuario que foi criado;
     return response.json(classToClass(user));
  }
}
/* ************************************************************************** */
