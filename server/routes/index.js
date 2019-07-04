import { Router } from 'express';
import asyncify from 'express-asyncify';
import api from './api';
import fs from 'fs';
import crypto from 'crypto';
import FileController from '../controllers/FileController';
import { REPL_MODE_SLOPPY } from 'repl';

const routes = asyncify(new Router());
const folder = './data/';
const tokenPath = folder + 'token';
const FC = new FileController();

const tokenInFile = crypto.randomBytes(48).toString('hex');
console.log('tokenInFile : ', tokenInFile);
FC.write(tokenPath, tokenInFile);

async function isLogin(sessionToken) {
  if (sessionToken == undefined) {
    return false;
  } else {
    let token = (await FC.read(tokenPath)).toString();
    if ((token == null) || (sessionToken != token)) {
      return false;
    }
    return true;
  }
}

function renderLoginPage(res) {
  res.render('pages/login.ejs');
}

async function renderPage(sessionToken, res, renderCallback) {
  if (true == await isLogin(sessionToken)) {
    renderCallback();
  } else {
    renderLoginPage(res);
  }
}

routes.get('/', async (req, res, next) => {
  renderPage(req.session.token, res, function () {
    res.render('pages/index.ejs');
  });
});

routes.get('/login', async (req, res, next) => {
  renderLoginPage(res);
});

routes.get('/add', (req, res, next) => {
  renderPage(req.session.token, res, function () {
    res.render('pages/add.ejs', { data: {} });
  });
});

routes.get('/edit/', (req, res, next) => {
  renderPage(req.session.token, res, function () {
    res.render('pages/edit.ejs', {
      data: {
        title: req.query.title,
        contents: req.query.contents
      }
    });
  });
});

routes.get('/list', (req, res, next) => {
  let filenames = new Array;

  let files = fs.readdirSync(folder);
  files.forEach(file => {
    filenames.push(file);
  });

  renderPage(req.session.token, res, function () {
    res.render('pages/list.ejs', {
      data: filenames
    });
  });
});


exports.api = api;

export default routes;