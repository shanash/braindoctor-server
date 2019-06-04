import { Router } from 'express';
import api from './api';
const routes = new Router();

routes.get('/', (req, res) => res.status(400).end());

exports.api = api;

export default routes;