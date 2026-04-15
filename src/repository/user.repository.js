import User from "../models/user.model.js";
import ServerError from "../helpers/error.helper.js";

class UserRepository {

  async create(username, email, password) {
    try {
      await User.create({
        name: username, 
        email: email, 
        password: password
      });
    } catch (error) {
      // Duplicado por email o username
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ServerError(`El ${field} ya está registrado`, 409);
      }
      // Validación fallida
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  }
  async deleteById(user_id) {
    await User.findByIdAndDelete(user_id);
  }
  async getById(user_id) {
    try {
      return await User.findById(user_id);
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de usuario inválido", 400);
      }
      throw error;
    }
  }
  async updateById(id, new_user_props) {
    try {
      const new_user = await User.findByIdAndUpdate(
        id,
        new_user_props,
        { returnDocument: 'after' },
      );
      return new_user;
    } catch (error) {
      if (error.name === "CastError") {
        throw new ServerError("ID de usuario inválido", 400);
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new ServerError(`Validación fallida: ${messages.join(", ")}`, 400);
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ServerError(`El ${field} ya está registrado`, 409);
      }
      throw error;
    }
  }
  async getByEmail(email) {
    const user = await User.findOne({email: email});
    return user;
  }

  async getUsers(){
    const user =  await User.findOne();
    return user;
  }

  async getByUsername(name) {
    const user = await User.findOne({ name: name });
    return user;
  }
}

const userRepository = new UserRepository();

export default userRepository;
