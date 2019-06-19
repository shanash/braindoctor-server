import { Router } from 'express';
import api from './api';
import fs from 'fs';
import FC from '../controllers/FileController';

const routes = new Router();
const folder = './data/';

routes.get('/', (req, res) => res.render('pages/index.ejs'));//.status(400).end());
routes.get('/add', (req, res) => res.render('pages/add.ejs', {data: {}}));
routes.get('/edit/', (req, res) => {
    res.render('pages/edit.ejs', {
        data: {
          contents: req.query.contents
        }
    });
});
routes.get('/list', (req, res) => {
    let filenames = new Array;

    let files = fs.readdirSync(folder);
    files.forEach(file => {
        filenames.push(file);
    });

    res.render('pages/list.ejs', {
    data: filenames
});});

exports.api = api;

export default routes;