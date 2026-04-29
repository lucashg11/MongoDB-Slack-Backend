import multer from "multer";
import ServerError from "../helpers/error.helper.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new ServerError("Solo se permiten archivos de imagen", 400), false);
        }
    }
});

export default upload;