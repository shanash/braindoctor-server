import { Router } from 'express';
import FC from '../controllers/FileController';
import fs from 'fs';

const routes = new Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
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
let upload = multer({ storage: storage});

routes.post('/upload/create', upload.single('imgFile'), FC.add);
routes.get('/download/:id', FC.get);

export default routes;
