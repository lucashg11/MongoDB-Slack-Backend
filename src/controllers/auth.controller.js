
import ServerError from "../helpers/error.helper.js";
import authService from "../services/auth.service.js";
import ENVIRONMENT from "../config/env.config.js";


class AuthController {
    async register(req, res, next) {

        try {

            const { email, name, password } = req.body;

            await authService.register({ name, email, password })

            return res.status(201).json({
                ok: true,
                status: 201,
                message: "El usuario se ha creado exitosamente",
            });
        }
        catch (error) {
            next(error);
        }

    }


    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const auth_token = await authService.login({ email, password });
            return res.status(200).json({
                message: "Login successful",
                status: 200,
                ok: true,
                data: {
                    auth_token: auth_token
                }
            });
        }
        catch (error) {
            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { verify_email_token } = req.query
            await authService.verifyEmail({ verify_email_token })
            res.status(200).send(
                `
                <body style="margin:0; padding: 0;">
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #655dd4; font-family: sans-serif; color: white;">
                        <h1 style="margin:0; padding: 0; font-family: sans-serif;">Mail verificado exitosamente</h1>
                        <p id="countdown" style="font-size: 1.2rem; margin-top: 1rem; font-family: sans-serif;">Serás redirigido en 3 segundos...</p>
                    </div>
                </body>
                <script>
                    let seconds = 3;
                    const countdownElement = document.getElementById('countdown');
                    const interval = setInterval(() => {
                        seconds--;
                        if (seconds > 0) {
                            countdownElement.innerText = \`Serás redirigido en \${seconds} segundos...\`;
                        } else {
                            clearInterval(interval);
                            countdownElement.innerText = "Redirigiendo...";
                            window.history.back();
                            setTimeout(() => {
                                window.location.href = "${ENVIRONMENT.URL_FRONTEND}";
                            }, 1000);
                        }
                    }, 1000);
                </script>
                `
            )
        }
        catch (error) {
            next(error);
        }
    }

    async resetPasswordRequest(req, res, next) {
        try {
            const { email } = req.body;
            await authService.resetPasswordRequest({ email })
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Se ha enviado un email para restablecer la contraseña"
            })
        }
        catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { reset_password_token } = req.params;
            const { password } = req.body;
            await authService.resetPassword({ reset_password_token, password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Has cambiado la contraseña con exito"
            })
        }
        catch (error) {
            next(error);
        }
    }
}
const authController = new AuthController();
export default authController