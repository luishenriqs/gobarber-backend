import { Router } from 'express';
/* 'celebrate' => Biblioteca de validação, atua como um midleware; */
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

/* ************************************************************************** */
// Aplicando o middleware em todas as rotas;
providersRouter.use(ensureAuthenticated);
/* ************************************************************************** */

/* *************************[LIST PROVIDERS]********************************* */
// Rota para lista todos os providers exceto o usuário logado.
providersRouter.get('/', providersController.index);
/* ************************************************************************** */

/* ************************[DAY AVAILABILITY]******************************** */
// Rota para listar cada dia do mês e a disponibilidade do provider no dia;
// OBS: 'celebrate': Validando o seguimento PARAMS (request.params);
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index,
);
/* ************************************************************************** */

/* **************************[AVAILABILITY]********************************** */
/* Rota para listar todos os horários de um provider no dia específico e suas
respectivas disponibilidades; */
// OBS: 'celebrate': Validando o seguimento PARAMS (request.params);
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index,
);
/* ************************************************************************** */

export default providersRouter;
