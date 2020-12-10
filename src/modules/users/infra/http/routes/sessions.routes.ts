import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const sessionsRouter = Router();

/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

sessionsRouter.post('/', async (request, response) => {
  /* ATENÇÃO!
  Instância de "UsersRepository" temporariamente dentro de cada rota
   para resolver bug descrito na aula do módulo 4,
   "Refatorando módulo de usuário, minuto 14. " */
  const usersRepository = new UsersRepository();
  const { email, password } = request.body;
  console.log(email, password);

  const authenticateUser = new AuthenticateUserService(usersRepository);

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});
export default sessionsRouter;
