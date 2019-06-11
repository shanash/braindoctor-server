import { Router } from 'express';
import api from './api';
import fs from 'fs';

const routes = new Router();
const folder = './data/';

routes.get('/', (req, res) => res.status(400).end());
routes.get('/upload', (req, res) => {res.render('upload.ejs');});
routes.get('/list', (req, res) => {
    let filenames = new Array;

    let files = fs.readdirSync(folder);
    files.forEach(file => {
        filenames.push(file);
    });

    res.render('list.ejs', {
    data: filenames
});});

exports.api = api;

export default routes;