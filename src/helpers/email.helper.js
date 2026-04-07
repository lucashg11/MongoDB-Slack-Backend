import ENVIRONMENT from "../config/env.config.js";

export const EMAIL_TEMPLATES = {
    VERIFY_EMAIL: (name, verify_email_token) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #655dd4; text-align: center;">Bienvenido ${name}</h1>
            <p style="font-size: 16px; color: #333; line-height: 1.5;">
                ¡Gracias por registrarte! Para completar el proceso de creación de tu cuenta y empezar a usar la plataforma, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente botón:
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verify_email_token=${verify_email_token}" 
                   style="background-color: #655dd4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Verificar Correo Electrónico
                </a>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">
                Si no creaste una cuenta con nosotros, puedes ignorar este mensaje de forma segura.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">
                Este es un correo automático, por favor no respondas a este mensaje.
            </p>
        </div>
    `,
    RESET_PASSWORD: (name, reset_password_token) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #655dd4; text-align: center;">Hola ${name}</h1>
            <p style="font-size: 16px; color: #333; line-height: 1.5;">
                Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, simplemente ignora este correo.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${ENVIRONMENT.URL_FRONTEND}/reset-password/${reset_password_token}" 
                   style="background-color: #655dd4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Restablecer Contraseña
                </a>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center;">
                Este enlace expirará pronto por razones de seguridad.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">
                Este es un correo automático, por favor no respondas a este mensaje.
            </p>
        </div>
    `
};
