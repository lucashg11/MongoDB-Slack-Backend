import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/env.config.js";
import mailerTransporter from "../config/mailer.config.js";
import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";
import { EMAIL_TEMPLATES } from "../helpers/email.helper.js";


class AuthService {
    async register({ name, email, password }) {
        if (!name || !email || !password) {
            throw new ServerError("Email, nombre de usuario y contraseña son obligatorios", 400);
        }

        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) {
            throw new ServerError('Email ya en uso!', 400)
        }
        const userByUsername = await userRepository.getByUsername(name);
        if (userByUsername) {
            throw new ServerError('Nombre de usuario ya en uso!', 400)
        }
        const passwordHashed = await bcrypt.hash(password, 12);
        const userCreated = await userRepository.create(name, email, passwordHashed);
        await this.sendVerifyEmail({ email, name });
    }

    async verifyEmail({ verify_email_token }) {
        if (!verify_email_token) {
            throw new ServerError('No existe token', 400)
        }

        try {
            const { email, name } = jwt.verify(verify_email_token, ENVIRONMENT.JWT_SECRET_KEY)
            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError("El usuario no existe", 404)
            }
            else if (user.email_verified) {
                throw new ServerError("El usuario ya fue validado", 400)
            }
            else {
                const user_updated = await userRepository.updateById(
                    user._id,
                    { email_verified: true }
                )
                if (!user_updated.email_verified) {
                    throw new ServerError("No se pudo actualizar", 400)
                }
                else {
                    return user_updated
                }
            }
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                const { email, name } = jwt.decode(verify_email_token)
                await this.sendVerifyEmail({ email, name })
                throw ServerError("Token Expirado", 401)
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError("Token invalido", 401)
            }
            else {
                throw error
            }
        }
    }

    async login({ email, password }) {
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Usuario no encontrado', 404)
        }
        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) {
            throw new ServerError('Contraseña incorrecta', 401)
        }
        const auth_token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                id: user._id,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )
        return auth_token
    }



    async sendVerifyEmail({ email, name }) {
        const verify_email_token = jwt.sign(
            {
                email: email,
                name: name
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        );
        await mailerTransporter.sendMail(
            {
                from: ENVIRONMENT.MAIL_USER,
                to: email,
                subject: `Bienvenido ${name} verifica tu correo electronico`,
                html: EMAIL_TEMPLATES.VERIFY_EMAIL(name, verify_email_token)
            }
        )
    }


    async resetPasswordRequest({ email }) {
        if (!email) {
            throw new ServerError('Email es requerido', 400);
        }

        try {
            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError('Usuario no encontrado', 404)
            }
            const reset_password_token = jwt.sign(
                {
                    email
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: '1d'
                }
            );

            await mailerTransporter.sendMail(
                {
                    from: ENVIRONMENT.MAIL_USER,
                    to: email,
                    subject: `Solicitud de restablecimiento de contraseña`,
                    html: EMAIL_TEMPLATES.RESET_PASSWORD(user.name, reset_password_token)
                }
            )
        } catch (error) {
            if (error instanceof ServerError) {
                throw error
            } else {
                throw new ServerError('Error inesperado en la solicitud de restablecimiento de contraseña', 500)
            }
        }
    }

    async resetPassword({ reset_password_token, password }) {
        if (!reset_password_token || !password) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }

        try {
            const { email } = jwt.verify(reset_password_token, ENVIRONMENT.JWT_SECRET_KEY);
            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError("El usuario no existe", 404)
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            await userRepository.updateById(user.id, { password: hashedPassword })
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError("Token invalido", 400)
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError("Token expirado", 400)
            }
            throw error
        }
    }


}

const authService = new AuthService()

export default authService