import { Router } from 'express';
import FC from '../controllers/FileController';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

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

routes.get('/download/:id', FC.get);

routes.post('/read', storage.single('data'), FC.read);
routes.post('/parse-excel', storage.single('data'), FC.parseExcel);
routes.post('/write', FC.write);

export default routes;
