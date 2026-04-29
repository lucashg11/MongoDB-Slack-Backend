import userRepository from "../repository/user.repository.js";
import ServerError from "../helpers/error.helper.js";

class UserService {
    async updateProfile(userId, { name, profile_bio, profile_picture }) {
        const updateData = {};
        if (name) updateData.name = name;
        if (profile_bio !== undefined) updateData.profile_bio = profile_bio;
        if (profile_picture) updateData.profile_picture = profile_picture;

        const updatedUser = await userRepository.updateById(userId, updateData);
        if (!updatedUser) {
            throw new ServerError("Usuario no encontrado", 404);
        }
        return updatedUser;
    }

    async getUserById(userId) {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ServerError("Usuario no encontrado", 404);
        }
        return user;
    }
}

export default new UserService();
