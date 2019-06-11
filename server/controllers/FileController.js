import BaseController from './BaseController';
import excelToJson from 'convert-excel-to-json';
import fs from 'fs';

class FileController extends BaseController {
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch(e) {
      return false;
    }
    return true;
  }

  async add(req, res, next) {
    super.add();
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
      let strJson = result.toString();

      if ( false == isJsonString(strJson) ) {
        let data = excelToJson({source:result});

        strJson = JSON.stringify(data);
      }

      res.json(strJson);

      let writeStream = fs.createWriteStream('./data/' + req.file.filename.split('.')[0] + '.json');
      writeStream.write(strJson);
      writeStream.end();
    });
  }

  async get(req, res, next) {
    super.get();
    const id = req.params.id;

    const file = './data/' + id;
    res.download(file);
  }
}

const FC = new FileController();

export default FC;