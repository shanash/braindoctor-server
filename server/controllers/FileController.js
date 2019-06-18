import BaseController from './BaseController';
import excelToJson from 'convert-excel-to-json';
import fs from 'fs';

var FileController = class FileController extends BaseController {
  async parse(req, res, next) {
    const convertValue = (value) => {
      var strValue = value.toString();
      if ( true == strValue.includes('\r\n') ) {
        var jarr = new Array();
        var arrValue = strValue.split('\r\n');
        arrValue.forEach(function (item, index, array) {
          jarr.push(item);
        });

        return jarr;
      }

      return value;
    }

    const convertDataForClient = (data) => {
      var result = new Object();
      Object.keys(data).forEach(function(key) {
        switch(key) {
          case 'Common':
            var commonData = data[key]; 
            var jCommon = new Object();
            Object.keys(commonData).forEach(function(index) {
              if (index != 0) {
               jCommon[commonData[index]['A']] = convertValue(commonData[index]['B']);
              }
            });
            result['Common'] = jCommon;
            break;
          case 'List':
            var listData = data[key];
            var jList = new Array();
            Object.keys(listData).forEach(function(index) {
              if (index != 0) {
                var jobj = new Object();
                Object.keys(listData[index]).forEach(function(innerKey) {
                  jobj[listData[0][innerKey]] = convertValue(listData[index][innerKey]);
                });
                jList.push(jobj);
              }
            });
            result['List'] = jList;
            break;
          case 'Dictionary':
            var dicData = data[key];
            var jDic = new Object();
            Object.keys(dicData).forEach(function(index) {
              if (index != 0) {
                var jobj = new Object();
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
      var jData = convertDataForClient(data);

      strJson = JSON.stringify(jData, null, '\t');
      res.render('pages/add', {
        data: {
          contents: strJson
        }
      });

    }    
    let path = req.file.destination + req.file.filename;
    let readStream = fs.createReadStream(path);
    
    let chunks = [];

    readStream.on('readable', onReadStreamReadable);
    readStream.on('end', onReadStreamEnd);


  }

  async add(req, res, next) {
    super.add();
  }

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