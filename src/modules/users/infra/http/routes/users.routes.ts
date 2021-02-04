import { Router } from 'express';
/* 'celebrate' => Biblioteca de validação, atua como um midleware; */
import { celebrate, Joi, Segments } from 'celebrate';
// O multer é um middleware para upload de arquivos.
import multer from 'multer';
// uploadConfig são as configurações definidas para meus uploads.
import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersControllers';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);

const usersController = new UsersController();
const userAvatarController =  new UserAvatarController();

/* ************************************************************************** */
/* Rota para criação usuario; */
/* OBS: 'celebrate': Validando o seguimento BODY (request.body); */
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);
/* ************************************************************************** */

/* ************************************************************************** */
/* Rota para alteração de avatar do usuario; */
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
);
/* ************************************************************************** */

export default usersRouter;
