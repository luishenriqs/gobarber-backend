import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch('/avatar', ensureAuthenticated, async (request, response) => {
  return response.json({ ok: true });
});
export default usersRouter;
