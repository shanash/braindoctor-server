import Utility from './Utility';
import { FileConventionError } from '../errors'

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
      return new FileConventionError('Why r u Inputed json string?');
    }

    let result = this.parseDetail(data);

    return result;
  }
}