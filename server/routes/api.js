import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import request from 'request';
import url from 'url';
import FileController from '../controllers/FileController';

const FC = new FileController();
const routes = new Router();

const storageXlsx = multer.diskStorage({
    destination: function(req, file ,callback){
      let dir = './upload';

      if (false == fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      
      callback(null, "upload/")
    },
    filename: function(req, file, callback){
      let extension = path.extname(file.originalname);
      let basename = path.basename(file.originalname, extension);
      callback(null, basename + "-" + Date.now() + extension);
    }
  });
let storage = multer({ storage: storageXlsx});

routes.get('/download/:id', async (req, res) => {
  const id = req.params.id;
  const path = './data/' + id;
  if (false == fs.existsSync(path))
  {
    return res.status(404);
  }

  res.download(path);
});
routes.post('/remove', async (req,res, next) => {
  let path = './data/' + req.body.filename;
  if (FC.remove(path) == false) {
    return res.status(404);
  }

  res.redirect(302, '/list');
});

routes.post('/edit', async (req, res, next) => {
  let path = './data/' + req.body.filename;
  let data = await FC.read(path);

  res.redirect(url.format({
    pathname:'/edit',
    query: {
      title: req.body.filename.split('.')[0],
      contents: data.toString()
    }
  }));
});

routes.post('/read-excel', storage.single('data'), async (req, res, next) => {
  let path = req.file.destination + req.file.filename;
  let data = await FC.read(path);
  let jsonString = await FC.parseExcel(data);

  res.redirect(url.format({
    pathname:'/edit',
    query: {
      contents: jsonString
    }
  }));
});
routes.post('/write', async (req, res, next) => {
  const path = './data/' + req.body.title + '.json';
  await FC.write(path, req.body.contents);

  res.redirect(302, '/list');
});

export default routes;
