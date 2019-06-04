import BaseController from './BaseController';
import { User } from '../models';

class UserController extends BaseController {

  list = async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (e) {
      console.error(e);
      next();
    }
  }

  get = async (req, res, next) => {
    const id = req.params.id;
    try {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        res.json(user);
      } else {
        res.status(204).end();
      }
    } catch (e) {
      console.error(e);
      next();
    }
  }

  add = async (req, res, next) => {
    const body = req.body;
    const data = {
      uid: body.uid,
      nick: body.nick,
      email: body.email,
      platform: body.platform,
      provider: body.provider
    }
    try {
      let user = await User.findOne({ where: { uid: data.uid } });
      if (user) {
        Object.keys(data).forEach(key => user[key] = data[key]);
        user = await user.save();
      } else {
        user = await User.create(data);
      }
      res.json(user);
    } catch (e) {
      console.error(e);
      next();
    }
  }
}

export default new UserController();