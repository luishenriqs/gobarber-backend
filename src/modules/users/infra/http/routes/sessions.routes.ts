import { Router } from 'express';
import SessionsController from '../controllers/SessionsControllers';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

sessionsRouter.post('/', sessionsController.create);
export default sessionsRouter;
