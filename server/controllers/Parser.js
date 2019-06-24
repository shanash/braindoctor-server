import Utility from './Utility';

export default class Parser {

  constructor() {
    if (this.parseDetail == undefined) {
      throw new TypeError("Must override method \'parseDetail\'");
    }
  }
  /*
  async parseDetail(data) {
      return data;
  }
  */

  isWrongData(data) {
    return Utility.isJsonString(data);
  }

  parse(data) {
    if (true == this.isWrongData(data)) {
      return null;
    }

    let result = this.parseDetail(data);

    return result;
  }
}