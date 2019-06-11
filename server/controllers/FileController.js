import BaseController from './BaseController';
import excelToJson from 'convert-excel-to-json';
import fs from 'fs';

class FileController extends BaseController {
  isJsonString() {
    console.log('call IsJsonString');
  }

  add = async (req, res, next) => {
    let path = req.file.destination + req.file.filename;
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
      let dir = './data';
  
      if (false == fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      let result = Buffer.concat(chunks);
      let strJson;

      try {
        JSON.parse(result.toString());
        strJson = result.toString();
        console.log('success');
      } catch (e) {
        console.log('e : ', e);
        let data = excelToJson({source:result});

        strJson = JSON.stringify(data);

      }
      res.json(strJson);

      let writeStream = fs.createWriteStream('./data/' + req.file.filename.split('.')[0] + '.json');
      writeStream.write(strJson);
      writeStream.end();
    });
  }

  get = async (req, res, next) => {
    const id = req.params.id;

    const file = './data/' + id;
    res.download(file);
  }
}

const FC = new FileController();

export default FC;