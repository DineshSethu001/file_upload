const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const path = require("path")

// Maximum file size (1MB)
let file_size = 1 * 1024 * 1024

// Configure storage (where and how to save files)
const storage = multer.diskStorage({
    // Folder location
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Save files in "uploads" folder
    },
    // File name format
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname) // get file extension
        const newName = `${uuidv4()}${extension}` // random unique name with extension
        cb(null, newName)
    }
})

// File type filter (allow only specific formats)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const isAllowed = allowedTypes.test(file.mimetype)
    if (isAllowed) {
        cb(null, true) // accept file
    } else {
        cb(new Error("Only jpeg, jpg, png, and pdf files are allowed"), false)
    }
}

// Export the multer middleware
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: file_size // limit file size to 1MB
    },
    fileFilter: fileFilter
})
