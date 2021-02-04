import { Router } from 'express';
/* 'celebrate' => Biblioteca de validação, atua como um midleware; */
import { celebrate, Joi, Segments } from 'celebrate';
import ProfileController from '../controllers/ProfileControllers';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();

const profileController = new ProfileController();

/* ************************************************************************** */
/* Aplicando o middleware em todas as rotas; */
profileRouter.use(ensureAuthenticated);
/* ************************************************************************** */

/* **************************[SHOW PROFILE]********************************** */
/* Rota para listar; */
profileRouter.get('/', profileController.show);
/* ************************************************************************** */

/* ***************************[UPDATE PROFILE]******************************* */
/* Rota para fazer alterações no perfil do usuario; */
/* OBS: 'celebrate': Validando o seguimento BODY (request.body); */
/* OBS: '.valid(Joi.ref('password'))' => Único valor válido é o 'password'; */
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);
/* ************************************************************************** */

export default profileRouter;
