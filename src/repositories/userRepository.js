import UserDao from "../dao/userDao.js";
import CartRepository from "./cartRepository.js";

const userDao = new UserDao();
const cartRepository = new CartRepository();

class UserRepository {
  async register(userData) {
    const newCart = await cartRepository.createCart();
    const defaultRole = "user";
    const userToSave = {
      ...userData,
      cart: newCart._id,
      role: defaultRole,
    };
    return await userDao.create(userToSave);
  }

  async getByEmail(email) {
    return await userDao.getByEmail(email);
  }

  async getById(id) {
    return await userDao.getById(id);
  }

  async resetPassword(id, newPassword) {
    return await userDao.updatePassword(id, newPassword);
  }
}

export default UserRepository;
