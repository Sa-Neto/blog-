import multer from 'multer';
import path from 'path';

// destination to store image

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = ''
    if (req.baseUrl.includes('image')) {
      folder = 'image'
    }
    cb( null,`uploads/${folder}/`)
  },
})
