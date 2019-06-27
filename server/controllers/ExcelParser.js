import excelToJson from 'convert-excel-to-json';
import Parser from './Parser';
import { FileConventionError } from '../errors'

export default class ExcelParser extends Parser {
  parseDetail(data) {
    const ConvertValue = (value) => {
      let strValue = value.toString();
      console.log('strValue : ', strValue);
      if (true == strValue.includes('\r\n')) {
        let jarr = new Array();
        let arrValue = strValue.split('\r\n');
        arrValue.forEach(function (item, index, array) {
          jarr.push(item);
        });

        return jarr;
      }

      return value;
    }

    let result = new Object();

    try {
      let excelData = excelToJson({ source: data });
      Object.keys(excelData).forEach(function (sheetName) {
        switch (sheetName) {
          case 'Common':
            {
              let sheet = excelData[sheetName];
              let jCommon = new Object();
              Object.keys(sheet).forEach(function (hIndex) {
                console.log('hindex : ', hIndex, ' : ', sheet[hIndex]['A']); 
                if (hIndex != 0) {
                  if (sheet[hIndex]['A'] === undefined ) {
                    throw new FileConventionError('Common : Not Inserted key');
                  }
                  let value = ConvertValue(sheet[hIndex]['B']);

                  if (value === undefined ) {
                    throw new FileConventionError('Common : Not Inserted value');
                  }
                  
                  jCommon[sheet[hIndex]['A']] = value;
                }
              });
              result['Common'] = jCommon;
              break;
            }
          case 'List':
            {
              let sheet = excelData[sheetName];
              let jList = new Array();
              Object.keys(sheet).forEach(function (hIndex) {
                if (hIndex != 0) {
                  let jobj = new Object();
                  Object.keys(sheet[hIndex]).forEach(function (wIndex) {
                    if (sheet[0][wIndex] === undefined) {
                      throw new FileConventionError('List : Not Inserted key');
                    }
                    let value = ConvertValue(sheet[hIndex][wIndex]);;

                    if (value === undefined ) {
                      throw new FileConventionError('List : Not Inserted value');
                    }
  
                    jobj[sheet[0][wIndex]] = value;
                  });
                  jList.push(jobj);
                }
              });
              result['List'] = jList;
              break;
            }
          case 'Dictionary':
            {
              let sheet = excelData[sheetName];
              let jDic = new Object();
              Object.keys(sheet).forEach(function (hIndex) {
                if (hIndex != 0) {
                  let jobj = new Object();
                  Object.keys(sheet[hIndex]).forEach(function (wIndex) {
                    if (wIndex != 'A') {
                      if (sheet[0][wIndex] === undefined) {
                        throw new FileConventionError('Dictionary : Not Inserted key');
                      }
                      let value = ConvertValue(sheet[hIndex][wIndex]);
                      if (value === undefined ) {
                        throw new FileConventionError('Dictionary : Not Inserted value');
                      }
                      jobj[sheet[0][wIndex]] = value;
                    }
                  });
                  jDic[sheet[hIndex]['A']] = jobj;
                }
              });
              result['Dictionary'] = jDic;
              break;
            }
          default:
            {
              throw new FileConventionError('Inserted wired sheet name.');
            }
            break;
        }
      });
    } catch (e) {
      return e;
    }

    return result;
  }

  isWrongData(data) {
    if (true == super.isWrongData(data)) {
      return true;
    }

    return false;
  }

  async parseToJsonString(data) {
    let jsonObject = await this.parse(data);
    if (jsonObject instanceof Error) return jsonObject;

    try
    {
      let result = JSON.stringify(jsonObject, null, '\t');
      return result;
    } catch(e) {
      return e;
    }
  }
}