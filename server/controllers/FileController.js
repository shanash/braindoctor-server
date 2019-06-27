import BaseController from './BaseController';
import fs from 'fs';
import aw from 'awaitify-stream';
import { UserNotFoundError } from '../errors'

export default class FileController extends BaseController {
  async read(path) {
    let readStream = fs.createReadStream(path);
    let reader = aw.createReader(readStream);
    let chunk, count = 0;
    let chunks = [];

    while (null !== (chunk = await reader.readAsync())) {
      // Perform any synchronous or asynchronous operation here.
      if (null != chunk) {
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

  // write()
  write(path, contents) {
    let writeStream = fs.createWriteStream(path);
    writeStream.write(contents);
    writeStream.end();
  }

  async remove(path) {
    try {
      if (false == fs.existsSync(path)) {
        return false;
      }
      fs.unlinkSync(path);
    } catch (e) {
    }

    return true;
  }
}

