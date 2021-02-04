import { Router } from 'express';
/* 'celebrate' => Biblioteca de validação, atua como um midleware; */
import { celebrate, Joi, Segments } from 'celebrate';
import SessionsController from '../controllers/SessionsControllers';

const sessionsRouter = Router();

const sessionsController =  new SessionsController();

/* ***************************[AUTHENTICATE]********************************* */
/* Rota de login(autenticacao); */
/* OBS: 'celebrate': Validando o seguimento BODY (request.body); */
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create
);
/* ************************************************************************** */

export default sessionsRouter;
