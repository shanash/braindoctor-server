import BaseController from './BaseController';
import { User } from '../models';
import excelToJson from 'convert-excel-to-json';

class FileController extends BaseController {
  add = async (req, res, next) => {
    let path = req.file.destination + req.file.filename;
    let fs = require('fs');
    let readStream = fs.createReadStream(path);
    
    let chunks = [];

    readStream.on('readable', function() {
      let chunk = readStream.read();
      if (null != chunk)
      {
        chunks.push(chunk);
      }
    });

    readStream.on('end', function() {
      let result = Buffer.concat(chunks);
      let data = excelToJson({source:result});
      
      console.log('data : ', data);
      res.json(data);

      let writeStream = fs.createWriteStream('./data/' + req.file.filename.split('.')[0] + '.json');
      writeStream.write(JSON.stringify(data));
      writeStream.end();
    });
  }

  get = async (req, res, next) => {
    const id = req.params.id;

    const file = './data/' + id;
    res.download(file);
  }
}

export default new FileController();