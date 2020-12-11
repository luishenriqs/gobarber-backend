import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

/* *************************************************************** */
// PAPEL DE UMA ROTA:
// Receber a requisição, chamar outro arquivo e devolver uma resposta.
/* **************************************************************** */

// Middleware a ser usado em todas as requisições.
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
export default appointmentsRouter;
