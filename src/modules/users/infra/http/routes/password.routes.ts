import { Router } from 'express';
/* 'celebrate' => Biblioteca de validação, atua como um midleware; */
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordControllers';
import ResetPasswordController from '../controllers/ResetPasswordControllers';

const passwordRouter = Router();

const forgotPasswordController =  new ForgotPasswordController();
const resetPasswordController =  new ResetPasswordController();

/* *************************[FORGOT PASSWORD]******************************** */
/* Rota para solicitar o reset de senha; */
/* OBS: 'celebrate': Validando o seguimento BODY (request.body); */
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);
/* ************************************************************************** */

/* **************************[RESET PASSWORD]******************************** */
/* Rota para resetar a senha; */
/* OBS: 'celebrate': Validando o seguimento BODY (request.body); */
/* OBS: '.valid(Joi.ref('password'))' => Único valor válido é o 'password'; */
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create
);
/* ************************************************************************** */

export default passwordRouter;
