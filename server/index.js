import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const port = 8081;
const app = express();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    }
});

const upload = multer({
    storage: storage
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

app.post('/upload', upload.single('file'), (req, res) => { 
    const file = req.file.filename;
    const title = req.body.title || '';
    const year = req.body.year || '';
    const author = req.body.author || '';

    // Ensure a new row is created for each upload
    const sql = "INSERT INTO users (pdf, title, year, author) VALUES (?, ?, ?, ?)";
    db.query(sql, [file, title, year, author], (err, result) => {
        if (err) return res.json({Message: "Error", error: err});
        return res.json({Status: "Success", id: result.insertId});
    });
});

app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) return res.json("Error");
        return res.json(result);
    });
});

app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            return res.status(404).send('File not found');
        }

        // Send the file if it exists
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error sending file: ${err}`);
                return res.status(500).send('Error sending file');
            }
        });
    });
});

app.get('/search/:key', (req, res)=>{

    const sql = "SELECT * FROM users WHERE title = ?"
    const data = req.params.key;
    db.query(sql, data ,(err, result, fields)=>{
        if(err){
            console.log("Error in searching");
        } 
        res.send(result);
    })

})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
