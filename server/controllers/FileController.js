import BaseController from './BaseController';
import excelToJson from 'convert-excel-to-json';
import fs from 'fs';
import aw from 'awaitify-stream';

export default class FileController extends BaseController {
  async read(path) {
    let readStream = fs.createReadStream(path);
    let reader = aw.createReader(readStream);
    let chunk, count = 0;
    let chunks = [];

    while (null !== (chunk = await reader.readAsync())) {
        // Perform any synchronous or asynchronous operation here.
        if (null != chunk)
        {
          chunks.push(chunk);
        }
        count++;
    }

    let dir = './data';
  
      if (false == fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      let data = Buffer.concat(chunks);

      return data; 
  }

  async parseExcel(data) {
    const isJsonString = (str) => {
      try {
        JSON.parse(str);
      } catch(e) {
        return false;
      }
      return true;
    }
    
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

    if (false == isJsonString(strJson)) {
      data = excelToJson({source:data});

    } else {
      data = JSON.parse(strJson);
    }

    let jData = convertDataForClient(data);
    let strJson = JSON.stringify(jData, null, '\t');

    return strJson
  }

  // write()
  async write(path, contents) {
    let writeStream = fs.createWriteStream(path);
    writeStream.write(contents);
    writeStream.end();
  }

  async remove(path) {
    if (false == fs.existsSync(path))
    {
      return false;
    }

    fs.unlinkSync(path);

    return true;
  }
}

