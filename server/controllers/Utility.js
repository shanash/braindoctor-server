export default class Utility {
  static isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}