import routes from '../routes/api';
import BaseController from './BaseController';
import excelToJson from 'convert-excel-to-json';
import fs from 'fs';
import request from 'request';
import url from 'url';

class FileController extends BaseController {

  // read()
  async read(req, res, next) {
    const isJsonString = (str) => {
      try {
        JSON.parse(str);
      } catch(e) {
        return false;
      }
      return true;
    }

    const onReadStreamReadable = () => {
      let chunk = readStream.read();
      if (null != chunk)
      {
        chunks.push(chunk);
      }
    }

    const onReadStreamEnd = () => {
      let dir = './data';
  
      if (false == fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      let result = Buffer.concat(chunks);
      let strJson = result.toString();
      let data;
      
      if (false == isJsonString(strJson)) {
        data = excelToJson({source:result});

        strJson = JSON.stringify(data);
      } else {
        data = JSON.parse(strJson);
      }
      
      const option = {
        uri:'http://localhost:3000/api/parse-excel/',
        method: 'POST',
        body: data,
        json: true
      }
      
      request.post('http://localhost:3000/api/parse-excel/', option, function(err,response,body) {
        res.redirect(url.format({
          pathname:'/edit',
          method:'post',
          query: {
            contents: response.body
          }
        }));
      });
    }

    let path = req.file.destination + req.file.filename;
    let readStream = fs.createReadStream(path);
    
    let chunks = [];

    readStream.on('readable', onReadStreamReadable);
    readStream.on('end', onReadStreamEnd);
  }

  // parseExcel()
  async parseExcel(req, res, next) {
    const convertValue = (value) => {
      let strValue = value.toString();
      if ( true == strValue.includes('\r\n') ) {
        let jarr = new Array();
        let arrValue = strValue.split('\r\n');
        arrValue.forEach(function (item, index, array) {
          jarr.push(item);
        });

        return jarr;
      }

      return value;
    }

    const convertDataForClient = (data) => {
      let result = new Object();
      Object.keys(data).forEach(function(key) {
        switch(key) {
          case 'Common':
            let commonData = data[key]; 
            let jCommon = new Object();
            Object.keys(commonData).forEach(function(index) {
              if (index != 0) {
               jCommon[commonData[index]['A']] = convertValue(commonData[index]['B']);
              }
            });
            result['Common'] = jCommon;
            break;
          case 'List':
            let listData = data[key];
            let jList = new Array();
            Object.keys(listData).forEach(function(index) {
              if (index != 0) {
                let jobj = new Object();
                Object.keys(listData[index]).forEach(function(innerKey) {
                  jobj[listData[0][innerKey]] = convertValue(listData[index][innerKey]);
                });
                jList.push(jobj);
              }
            });
            result['List'] = jList;
            break;
          case 'Dictionary':
            let dicData = data[key];
            let jDic = new Object();
            Object.keys(dicData).forEach(function(index) {
              if (index != 0) {
                let jobj = new Object();
                Object.keys(dicData[index]).forEach(function(innerKey) {
                  if (innerKey != 'A') {
                    jobj[dicData[0][innerKey]] = convertValue(dicData[index][innerKey]);
                  }
                });
                jDic[dicData[index]['A']] = jobj;
              }
            });
            result['Dictionary'] = jDic;
            break;
        }
      });

      return result;
    }

    const data = req.body;
    let jData = convertDataForClient(data);
    let strJson = JSON.stringify(jData, null, '\t');

    res.json(strJson);
  }

  // write()
  async write(req, res, next) {
    super.add();
    
    let writeStream = fs.createWriteStream('./data/' + req.body.title + '.json');
    writeStream.write(req.body.contents);
    writeStream.end();

    res.redirect(302, '/add');
  }

  // get()
  async get(req, res, next) {
    super.get();
    const id = req.params.id;
    const path = './data/' + id;
    if (false == fs.existsSync(path))
    {
      return res.status(404);
    }

    res.download(path);
  }
}

const FC = new FileController();

export default FC;