import { Router } from 'express';
import asyncify from 'express-asyncify';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import url from 'url';
import FileController from '../controllers/FileController';
import ExcelParser from '../controllers/ExcelParser';

const FC = new FileController();
const EP = new ExcelParser();
const routes = asyncify(new Router());

const folder = './data/';
const tokenPath = folder + 'token';


const storageXlsx = multer.diskStorage({
  destination: function (req, file, callback) {
    let dir = './upload';

    if (false == fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    callback(null, "upload/");
  },
  filename: function (req, file, callback) {
    let extension = path.extname(file.originalname);
    let basename = path.basename(file.originalname, extension);
    callback(null, basename + "-" + Date.now() + extension);
  }
});

let storage = multer({ storage: storageXlsx });

routes.get('/download/:id', async (req, res) => {
  const id = req.params.id;
  const path = './data/' + id;
  if (false == fs.existsSync(path)) {
    return res.status(404);
  }

  res.download(path);
});

routes.post('/remove', async (req, res, next) => {
  let path = folder + req.body.filename;
  let result = await FC.remove(path);
  if (result != null ) {
    throw result;
  }

  res.redirect(302, '/list');
});

routes.post('/edit', async (req, res, next) => {
  let path = folder + req.body.filename;
  let data = await FC.read(path);

  res.redirect(url.format({
    pathname: '/edit',
    query: {
      title: req.body.filename.split('.')[0],
      contents: data.toString()
    }
  }));
});

routes.post('/read-excel', storage.single('data'), async (req, res, next) => {
  let path = req.file.destination + req.file.filename;
  let data = await FC.read(path);
  let jsonString = await EP.parseToJsonString(data);
  if (jsonString instanceof Error) {
    throw jsonString;
  }

  res.redirect(url.format({
    pathname: '/edit',
    query: {
      contents: jsonString
    }
  }));
});

routes.post('/write', async (req, res, next) => {
  const path = folder + req.body.title + '.json';
  let result = FC.write(path, req.body.contents);
  if (result instanceof Error) {
    throw result;
  }

  res.redirect(302, '/list');
});

routes.post('/login', async(req, res, next) => {
  let token = (await FC.read(tokenPath)).toString();
  let password = req.body.password;
  
  if ( token == password ) {
    req.session.token = password;
    res.redirect('/');
  }
});

export default routes;
