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
app.use(cors({
    origin: 'http://localhost:5173', // Assuming this is where your frontend runs
    methods: ['GET', 'POST'],
    credentials: true
  }));
  
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
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
  });
// app.post('/upload', upload.single('file'), (req, res) => { 
//     const file = req.file.filename;
//     const title = req.body.title || '';
//     const year = req.body.year || '';
//     const author = req.body.author || '';

//     // Ensure a new row is created for each upload
//     const sql = "INSERT INTO users (pdf, title, year, author) VALUES (?, ?, ?, ?)";
//     db.query(sql, [file, title, year, author], (err, result) => {
//         if (err) return res.json({Message: "Error", error: err});
//         return res.json({Status: "Success", id: result.insertId});
//     });
// });


app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const file = req.file.filename;
        const title = req.body.title || '';
        const tags = req.body.tags || '';
        const year = req.body.year || '';
        const author = req.body.author || '';

        if (!file) {
            return res.status(400).json({Message: "File not provided"});
        }

        const sql = "INSERT INTO users (pdf, title, tags, year, author) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [file, title, tags, year, author], (err, result) => {
            if (err) {
                console.error("Database error: ", err);
                return res.status(500).json({Message: "Error", error: err});
            }
            return res.json({Status: "Success", id: result.insertId});
        });
    } catch (err) {
        console.error("Upload error: ", err);
        return res.status(500).json({Message: "Internal Server Error", error: err});
    }
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

// app.get('/search/:key', (req, res)=>{

//     const sql = "SELECT * FROM users WHERE title = ?" 
//     const data = req.params.key;
//     db.query(sql, data ,(err, result, fields)=>{
//         if(err){
//             console.log("Error in searching");
//         } 
//         res.send(result);
//     })

// })
app.get('/search/:key', (req, res) => {
    const key = req.params.key;
    const sql = `
        SELECT * FROM users 
        WHERE title LIKE ? 
        OR pdf LIKE ? 
        OR author LIKE ? 
        OR year LIKE ?
        OR tags LIKE ?
    `;
    const searchKey = `%${key}%`;
    db.query(sql, [searchKey, searchKey, searchKey, searchKey,searchKey], (err, result) => {
        if (err) {
            console.error("Error in searching", err);
            return res.status(500).json({ error: "Error in searching" });
        }
        res.json(result);
    });
});


// Existing code...

// Endpoint to get details about a specific file by ID
// app.get('/file/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM users WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         if (result.length > 0) {
//             res.json(result[0]);
//         } else {
//             res.status(404).json({ msg: 'File not found' });
//         }
//     });
// });

// // Endpoint to search by year and get all related files
// app.get('/search/year/:year', (req, res) => {
//     const year = req.params.year;
//     const sql = "SELECT * FROM users WHERE year = ?";
//     db.query(sql, [year], (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// });

// Existing code...


// app.post("/signup", async function (req, res) {
//     const name = req.body.name;
//     const username = req.body.username;
//     const password = req.body.password;

//     try {
//         db.connect(function (error) {
//             if (error) {
//                 throw error;
//             }
//             console.log("Connected to the database");
//         });

//         const sqlCheck = "SELECT * FROM Newusers WHERE username = ?";
//         const existingUser = await new Promise((resolve, reject) => {
//             db.query(sqlCheck, [username], function (error, result) {
//                 if (error) {
//                     return reject(error);
//                 }
//                 resolve(result);
//             });
//         });

//         if (existingUser.length > 0) {
//             db.end();
//             return res.status(403).json({
//                 msg: "User already exists",
//             });
//         }

//         const sqlInsert = "INSERT INTO Newusers (name, username, password) VALUES (?, ?, ?)";
//         await new Promise((resolve, reject) => {
//             db.query(sqlInsert, [name, username, password], function (error, result) {
//                 if (error) {
//                     return reject(error);
//                 }
//                 console.log("1 record inserted");
//                 resolve(result);
//             });
//         });

//         db.end();

//         res.json({
//             msg: "User created successfully",
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             msg: "An error occurred",
//         });
//     }
// });


// app.post("/signup", async function (req, res) {
//     const { name, email, password } = req.body;
  
//     try {
//       db.connect(function (error) {
//         if (error) {
//           throw error;
//         }
//         console.log("Connected to the database");
//       });
  
//       const sqlCheck = "SELECT * FROM Newusers WHERE email = ?";
//       const existingUser = await new Promise((resolve, reject) => {
//         db.query(sqlCheck, [email], function (error, result) {
//           if (error) {
//             return reject(error);
//           }
//           resolve(result);
//         });
//       });
  
//       if (existingUser.length > 0) {
//         db.end();
//         return res.status(403).json({
//           msg: "User already exists",
//         });
//       }
  
//       const sqlInsert = "INSERT INTO Newusers (name, email, password) VALUES (?, ?, ?)";
//       await new Promise((resolve, reject) => {
//         db.query(sqlInsert, [name, email, password], function (error, result) {
//           if (error) {
//             return reject(error);
//           }
//           console.log("1 record inserted");
//           resolve(result);
//         });
//       });
  

  
//       res.status(201).json({
//         msg: "User created successfully",
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         msg: "An error occurred",
//       });
//     }
//   });

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      pool.getConnection((err, connection) => {
        if (err) throw err; // Handle connection error
  
        const sqlCheck = 'SELECT * FROM newusers WHERE email = ?';
        connection.query(sqlCheck, [email], (error, result) => {
          if (error) {
            connection.release();
            return res.status(500).json({ msg: 'Error checking user' });
          }
  
          if (result.length > 0) {
            connection.release();
            return res.status(403).json({ msg: 'User already exists' });
          }
  
          const sqlInsert = 'INSERT INTO newusers (name, email, password) VALUES (?, ?, ?)';
          connection.query(sqlInsert, [name, email, password], (error, result) => {
            connection.release();
            if (error) return res.status(500).json({ msg: 'Error inserting user' });
  
            res.status(201).json({ msg: 'User created successfully' });
          });
        });
      });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ msg: 'An error occurred' });
    }
  });

// app.post("/signin", async function (req, res) {
//     const email = req.body.email;
//     const password = req.body.password;
//     db.connect(function (error) {
//         if (error) throw error;
//         console.log("Connected to the database");
//         var sql = "SELECT * FROM Newusers WHERE email = ? AND password = ?";
//         db.query(sql, [email, password], function (error, result) {
//             if (error) throw error;
//             if (result.length) {
//                 res.status(200).json({
//                     msg: "User logged in successfully",
//                 });
//             } else {
//                 res.status(403).json({
//                     msg: "Invalid username or password",
//                 });
//             }
//         });

//     });
// });



app.post('/signin', async function (req, res) {
    const { email, password } = req.body;

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting a database connection:', err);
                return res.status(500).json({
                    msg: 'Database connection error'
                });
            }

            console.log('Connected to the database');
            const sql = 'SELECT * FROM Newusers WHERE email = ? AND password = ?';

            connection.query(sql, [email, password], (error, result) => {
                connection.release(); // Always release the connection back to the pool after query execution

                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).json({
                        msg: 'Error executing query'
                    });
                }

                if (result.length > 0) {
                    res.status(200).json({
                        msg: 'User logged in successfully'
                    });
                } else {
                    res.status(403).json({
                        msg: 'Invalid username or password'
                    });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error during signin:', error);
        res.status(500).json({
            msg: 'An unexpected error occurred'
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
