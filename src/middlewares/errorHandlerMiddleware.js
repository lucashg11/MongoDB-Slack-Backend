function errorHandlerMiddleware(error, req, res, next) {
    console.error("Error capturado por middleware:", error);
    if (error.status) {
        return res.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        });
    }
    return res.status(500).json({
        ok: false,
        status: 500,
        message: 'Error Interno del Servidor'
    });
}

export default errorHandlerMiddleware;