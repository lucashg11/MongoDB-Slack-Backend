import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/env.config.js';
import ServerError from '../helpers/error.helper.js';

function authMiddleware(req, res, next) {
    try {
        const auth_header = req.headers.authorization
        if (!auth_header) {
            throw new ServerError('Token faltante', 401)
        }
        const auth_token = auth_header.split(' ')[1]

        if (!auth_token) {
            throw new ServerError('Token invalido', 401)
        }

        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)
        req.user = payload
        next()
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json(
                {
                    ok: false,
                    status: 401,
                    message: 'Token invalido'
                }
            )
        }
        //Errores esperables en el sistema
        if (error instanceof ServerError) {
            return res.status(error.status).json(
                {
                    ok: false,
                    status: error.status,
                    message: error.message
                }
            )
        }
        else {
            console.error('Error inesperado en el registro', error)
            return res.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: "Internal server error"
                }
            )
        }
    }

}

export default authMiddleware