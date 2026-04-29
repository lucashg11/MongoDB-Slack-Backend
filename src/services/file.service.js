import cloudinary from '../config/cloudinary.config.js';

class FileService {
    async uploadImage(file, folder = 'uploads') {
        const response = await cloudinary.uploader.upload(file, {
            resource_type: 'image',
            folder: folder,
            unique_filename: true,
            overwrite: false,
            transformation: [
                {
                    quality: 'auto',
                    fetch_format: 'auto'
                },
            ],
            allowed_formats: [
                'jpg',
                'jpeg',
                'png',
                'gif',
                'webp'
            ]
        })
        return response;
    }
}

const fileService = new FileService();

export default fileService;