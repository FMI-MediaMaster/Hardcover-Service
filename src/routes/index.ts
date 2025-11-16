import { Router } from 'express';
import hardcoverController from '@controllers/hardcover';

const routes: Router = Router();

routes.get('/:method', hardcoverController.handler);

export default routes;
