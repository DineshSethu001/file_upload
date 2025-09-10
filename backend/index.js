const express = require("express")
const path = require("path")
const cors = require("cors")
// Import the upload configuration from upload.js
const { upload } = require('./upload')

const app = express();
app.use(cors())

// Serve static files (so uploaded files can be accessed via browser)
// Example: http://localhost:3000/uploads/filename.png
const folderLocation = path.join(__dirname, "uploads")
app.use("/uploads", express.static(folderLocation))

// Root route (basic API check)
app.get("/", (req, res) => {
    res.send("API Working . . .");
})

// Upload a single file
// "single" → upload 1 file
// "image" → field name expected from the client
app.post("/upload/file", upload.single("image"), (req, res) => {
    return res.json({
        message: "File uploaded successfully",
        data: req.file // file info returned
    })
})

// Upload multiple files
// "array" → upload multiple files at once
// "images" → field name
// "12" → maximum number of files
app.post("/upload/files", upload.array("images", 12), (req, res) => {
    return res.json({
        message: "Files successfully uploaded",
        data: req.files // array of files
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    // If the error is thrown by Multer
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).send("Error: File too large! Maximum size is 1MB.")
            default:
                return res.status(400).send(`Multer Error: ${err.message}`)
        }
    } else {
        // Custom or unknown errors
        return res.status(400).json({ error: err.message })
    }
})

// Start server
app.listen(3000, () => {
    console.log("Server is running successfully on http://localhost:3000")
})
