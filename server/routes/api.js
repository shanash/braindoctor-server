import { Router } from 'express';
import FileController from '../controllers/FileController';

const routes = new Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file ,callback){
      let fs = require('fs');
      let dir = './upload';

      if (!fs.existsSync(dir)) {
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

routes.post('/upload/create', upload.single('imgFile'), FileController.add);
routes.get('/download/:id', FileController.get);

export default routes;
