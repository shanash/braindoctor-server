import excelToJson from 'convert-excel-to-json';
import Parser from './Parser';

export default class ExcelParser extends Parser {
  parseDetail(data) {
    const ConvertValue = (value) => {
      let strValue = value.toString();
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

    let excelData = excelToJson({ source: data });
    let result = new Object();
    Object.keys(excelData).forEach(function (sheetName) {
      switch (sheetName) {
        case 'Common':
          {
            let sheet = excelData[sheetName];
            let jCommon = new Object();
            Object.keys(sheet).forEach(function (hIndex) {
              if (hIndex != 0) {
                jCommon[sheet[hIndex]['A']] = ConvertValue(sheet[hIndex]['B']);
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
                  jobj[sheet[0][wIndex]] = ConvertValue(sheet[hIndex][wIndex]);
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
                    jobj[sheet[0][wIndex]] = ConvertValue(sheet[hIndex][wIndex]);
                  }
                });
                jDic[sheet[hIndex]['A']] = jobj;
              }
            });
            result['Dictionary'] = jDic;
            break;
          }
      }
    });

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
    let result = JSON.stringify(jsonObject, null, '\t');
    return result;
  }
}