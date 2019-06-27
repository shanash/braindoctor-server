import { Router } from 'express';
import asyncify from 'express-asyncify';
import api from './api';
import { UserNotFoundError } from '../errors'

const routes = asyncify(new Router());
const folder = './data/';

routes.get('/', (req, res, next) => res.render('pages/index.ejs'));//.status(400).end());
routes.get('/add', (req, res, next) => res.render('pages/add.ejs', {data: {}}));
routes.get('/edit/', (req, res, next) => {
    res.render('pages/edit.ejs', {
        data: {
          title: req.query.title,
          contents: req.query.contents
        }
    });
});
routes.get('/list', (req, res, next) => {
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