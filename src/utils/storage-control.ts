import { diskStorage } from "multer"
import { extname } from "path"

export let homeworkStorage = {
    storage: diskStorage({
        destination: "./uploads/homework",
        filename(req, file, callback) {
            let uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
            callback(null, uniqueName + extname(file.originalname))
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }
}

export let videoStorage = {
    storage: diskStorage({
        destination: "./uploads/videos",
        filename: (req, file, cb) => {
            let uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
            cb(null, uniqueName + extname(file.originalname))
        }
    }),
    limits: { fileSize: 100 * 1024 * 1024 }
}