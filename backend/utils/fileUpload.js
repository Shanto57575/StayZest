// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const uploadPath = path.join(path.dirname(''), 'uploads');
// fs.mkdirSync(uploadPath, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const fileFilter = (req, file, cb) => {
//     if (file && file.mimetype && file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type, only images are allowed!'), false);
//     }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;

import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file && file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only images are allowed!'), false);
    }
};

// Configure multer to use memory storage
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    }
});

export default upload;