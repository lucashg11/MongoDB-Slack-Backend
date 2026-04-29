import userService from "../services/user.service.js";
import authService from "../services/auth.service.js";

class UserController {
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { name, profile_bio, profile_picture } = req.body;

            const updatedUser = await userService.updateProfile(userId, { name, profile_bio, profile_picture });
            const new_token = authService.generateToken(updatedUser);

            return res.status(200).json({
                ok: true,
                message: "Perfil actualizado con éxito",
                data: {
                    user: updatedUser,
                    auth_token: new_token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await userService.getUserById(userId);

            return res.status(200).json({
                ok: true,
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
