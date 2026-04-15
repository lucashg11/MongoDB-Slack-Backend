function errorHandlerMiddleware(error, req, res, next) {
    console.error("Error capturado por middleware:", error);

    // Errores controlados (con status definido)
    if (error.status) {
        return res.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        });
    }

    // Error genérico de servidor
    return res.status(500).json({
        ok: false,
        status: 500,
        message: 'Error Interno del Servidor'
    });
}

export default errorHandlerMiddleware;