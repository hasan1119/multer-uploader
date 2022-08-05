// dependencies
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const createHttpError = require('http-errors');

function upload(directory, maxFileSize = 10000, allowFileTypesArray=[]) {

    let  uploadDir =  directory ? directory : './uploads';
    // upload dir 
    const dir = directory && fs.mkdirSync(uploadDir, {
        recursive: true
    }) || uploadDir;

    // storage
    const storage = multer.diskStorage({
        // destination
        destination: function (req, file, cb) {
            cb(null, dir)
        },

        // filename
        filename: function (req, file, cb) {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') + '-' + Date.now();

            cb(null, fileName + fileExt)
        }
    })

    // prepare the final multer upload object
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: maxFileSize
        },
        fileFilter: (req, file, cb) => {

                if (allowFileTypesArray.includes(file.mimetype)) {
                    cb(null, true)
                } else {
                    cb(createHttpError(404, `Only ${allowFileTypesArray.join(" ,")} are allowed`))
                }

            
        }
    })

    return upload;

}


module.exports = upload;