import multer from "multer"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  export const upload = multer({storage: storage})

  //* here the req will be the json data but we don't get it often to deal with files