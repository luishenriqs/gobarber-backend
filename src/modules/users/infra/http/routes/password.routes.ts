import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordControllers';
import ResetPasswordController from '../controllers/ResetPasswordControllers';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);
export default passwordRouter;
