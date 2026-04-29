import { Router } from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";
import fileService from "../services/file.service.js";
import ServerError from "../helpers/error.helper.js";

const fileRouter = Router();

fileRouter.post('/upload', authMiddleware, upload.single('file') ,async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ServerError("No se ha proporcionado ningún archivo", 400);
        }

        const folder = req.body.folder || 'uploads';

        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        const result = await fileService.uploadImage(base64Image, folder);

        return res.status(200).json({
            ok: true,
            message: "Imagen subida con éxito",
            data: {
                url: result.secure_url
            }
        });
    }
    catch (error) {
        next(error);
    }
});
export default fileRouter;