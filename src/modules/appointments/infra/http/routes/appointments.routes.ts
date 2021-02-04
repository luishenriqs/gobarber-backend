import { Router } from 'express';
/* 'celebrate' => Biblioteca de validação, atua como um midleware; */
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

/* ************************************************************************** */
// Aplicando o middleware em todas as rotas;
appointmentsRouter.use(ensureAuthenticated);
/* ************************************************************************** */

/* ************************************************************************** */
// Rota para criação de appointments;
// OBS: 'celebrate': Validando o seguimento BODY (request.body);
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);
/* ************************************************************************** */

/* ************************************************************************** */
// Rota de listagem dos appointments do usuário logado em um dia específico;
appointmentsRouter.get('/me', providerAppointmentsController.index);
/* ************************************************************************** */

export default appointmentsRouter;
