import { Router } from 'express';
import asyncify from 'express-asyncify';
import api from './api';
import fs from 'fs';
import crypto from 'crypto';
import FileController from '../controllers/FileController';

const routes = asyncify(new Router());
const folder = './data/';
const tokenPath = folder + 'token';
const FC = new FileController();

FC.write(tokenPath, crypto.randomBytes(48).toString('hex'));

routes.get('/', async (req, res, next) => {
  let sess = req.session;
  if (sess.token == undefined) {
    res.redirect('/login');
  } else {
    let token = (await FC.read(tokenPath)).toString();
    console.log('token : ', token);
    console.log('sess.token : ', sess.token);
    if ( (token == null) || (sess.token != token) ) {
      res.redirect('/login');
    }
    else {
      res.render('pages/index.ejs');
    }
  }
});

routes.get('/login', async (req, res, next) => {
  let token = (await FC.read(tokenPath)).toString();
  if (token == null) {
    return res.send(`wrong`);
  }
  let sess = req.session;
  sess.token = token;
  res.send(`Number : ${req.session.token}`);
});

routes.get('/add', (req, res, next) => res.render('pages/add.ejs', { data: {} }));
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
  });
});

exports.api = api;

export default routes;