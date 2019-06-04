import { Router } from 'express';
import UserController from '../controllers/UserController';

const routes = new Router();

routes.get('/users', UserController.list);
routes.get('/users/:id', UserController.get);
routes.post('/users', UserController.add);

export default routes;