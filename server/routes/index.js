import { Router } from 'express';
import api from './api';
const routes = new Router();

const folder = './data/';
const fs = require('fs');

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