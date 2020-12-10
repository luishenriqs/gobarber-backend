import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  console.log(email, password)

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});
export default sessionsRouter;
