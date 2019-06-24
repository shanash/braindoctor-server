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

    data = excelToJson({ source: data });
    let result = new Object();
    Object.keys(data).forEach(function (key) {
      switch (key) {
        case 'Common':
          let commonData = data[key];
          let jCommon = new Object();
          Object.keys(commonData).forEach(function (index) {
            if (index != 0) {
              jCommon[commonData[index]['A']] = ConvertValue(commonData[index]['B']);
            }
          });
          result['Common'] = jCommon;
          break;
        case 'List':
          let listData = data[key];
          let jList = new Array();
          Object.keys(listData).forEach(function (index) {
            if (index != 0) {
              let jobj = new Object();
              Object.keys(listData[index]).forEach(function (innerKey) {
                jobj[listData[0][innerKey]] = ConvertValue(listData[index][innerKey]);
              });
              jList.push(jobj);
            }
          });
          result['List'] = jList;
          break;
        case 'Dictionary':
          let dicData = data[key];
          let jDic = new Object();
          Object.keys(dicData).forEach(function (index) {
            if (index != 0) {
              let jobj = new Object();
              Object.keys(dicData[index]).forEach(function (innerKey) {
                if (innerKey != 'A') {
                  jobj[dicData[0][innerKey]] = ConvertValue(dicData[index][innerKey]);
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