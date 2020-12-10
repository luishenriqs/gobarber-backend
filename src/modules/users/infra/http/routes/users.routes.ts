import { Router } from 'express';
// O multer é um middleware para upload de arquivos.
import multer from 'multer';
// uploadConfig são as configurações definidas para meus uploads.
import CreateUserService from '@modules/users/services/CreateUserService';
import uploadConfig from '@config/upload';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '@modules/users/services/UpdatUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);


/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  /* ATENÇÃO!
  Instância de "UsersRepository" temporariamente dentro de cada rota
   para resolver bug descrito na aula do módulo 4,
   "Refatorando módulo de usuário, minuto 14. " */
  const usersRepository = new UsersRepository();

  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    /* ATENÇÃO!
  Instância de "UsersRepository" temporariamente dentro de cada rota
   para resolver bug descrito na aula do módulo 4,
   "Refatorando módulonde usuário, minuto 14. " */
    const usersRepository = new UsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });
    delete user.password;

    return response.json({ user });
  },
);

export default usersRouter;
