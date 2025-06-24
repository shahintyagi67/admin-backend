// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// import slugify from "slugify";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadPath = path.join(__dirname, "../../uploads/business_documents");
// fs.mkdirSync(uploadPath, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (_req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, ext);
//     const safeName = slugify(baseName, { lower: true, strict: true }); // removes emojis & symbols
//     cb(null, `${safeName}-${uniqueSuffix}${ext}`);
//   },
// });

// const upload = multer({ storage });
// export default upload;
import multer from "multer";
import storage from "../../config/cloudinary";

const upload = multer({ storage });

export default upload;
