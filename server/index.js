import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


// Load environment variables
dotenv.config();

const app = express();
const port = 8081;

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Assuming this is where your frontend runs
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    }
});

const upload = multer({ storage: storage });

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
    
});



// Authentication middleware

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      console.log("No token provided");
      return res.status(401).json({ msg: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log("Token verification failed:", err);
        return res.status(403).json({ msg: "Token verification failed", error: err });
      }
      console.log("Token verified, user:", user);
      req.user = user;
      next();
    });
  };


// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.get('/verify-token', authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });
  

// Endpoint to request a password reset link
app.post('/forget-password-linkemail', (req, res) => {
    const { email } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).json({ message: 'Database connection error', details: err });
        }

        const sql = 'SELECT * FROM newusers WHERE email = ?';
        connection.query(sql, [email], (error, result) => {
            if (error) {
                connection.release();
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Database query error', details: error });
            }

            if (result.length === 0) {
                connection.release();
                return res.status(404).json({ message: 'Email not found' });
            }

            const user = result[0];

            // Generate a reset token
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Store the token in the database with an expiration time (e.g., 1 hour)
            const resetTokenExpires = Date.now() + 3600000; // 1 hour from now

            const sqlUpdate = 'UPDATE newusers SET reset_token = ?, reset_token_expires = ? WHERE id = ?';
            connection.query(sqlUpdate, [resetToken, resetTokenExpires, user.id], (error) => {
                connection.release();
                if (error) {
                    console.error('Error updating user with reset token:', error);
                    return res.status(500).json({ message: 'Error updating user with reset token', details: error });
                }
                // Send the password reset email
                const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset Request',
                    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending reset email:', error);
                        return res.status(500).json({ message: 'Error sending reset email', details: error });
                    }

                    res.status(200).json({ message: 'Password reset link sent successfully' });
                });
            });
        });
    });
});
app.post('/reset-password', (req, res) => {
    const { token, password } = req.body;

    // Ensure both token and password are provided
    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting a database connection:', err);
            return res.status(500).json({ message: 'Database connection error', details: err });
        }

        // Check if the token is valid and not expired
        const sql = 'SELECT * FROM newusers WHERE reset_token = ? AND reset_token_expires > ?';
        connection.query(sql, [token, Date.now()], (error, result) => {
            if (error) {
                console.error('Error querying the database:', error);
                connection.release();
                return res.status(500).json({ message: 'Database query error', details: error });
            }

            if (result.length === 0) {
                connection.release();
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            const userId = result[0].id;

            // Update the user's password and clear the reset token
            const sqlUpdate = 'UPDATE newusers SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?';
            connection.query(sqlUpdate, [password, userId], (updateError) => {
                connection.release();
                if (updateError) {
                    console.error('Error updating password:', updateError);
                    return res.status(500).json({ message: 'Error updating password', details: updateError });
                }

                res.status(200).json({ message: 'Password reset successfully' });
            });
        });
    });
});


// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const file = req.file?.filename;
        const { title, tags, year, author } = req.body;

        if (!file) {
            return res.status(400).json({ Message: "File not provided" });
        }

        const sql = "INSERT INTO users (pdf, title, tags, year, author) VALUES (?, ?, ?, ?, ?)";
        pool.query(sql, [file, title, tags, year, author], (err, result) => {
            if (err) {
                console.error("Database error: ", err);
                return res.status(500).json({ Message: "Error", error: err });
            }
            return res.json({ Status: "Success", id: result.insertId });
        });
    } catch (err) {
        console.error("Upload error: ", err);
        return res.status(500).json({ Message: "Internal Server Error", error: err });
    }
});

// Retrieve all records
app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    pool.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Message: "Database error", error: err });
        return res.json(result);
    });
});

// Serve files
app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error sending file: ${err}`);
                return res.status(500).send('Error sending file');
            }
        });
    });
});

// Search records
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
    pool.query(sql, [searchKey, searchKey, searchKey, searchKey, searchKey], (err, result) => {
        if (err) {
            console.error("Error in searching", err);
            return res.status(500).json({ error: "Error in searching", details: err });
        }
        res.json(result);
    });
});


// const searchHistory = {};

// app.get('/search/:key', (req, res) => {
//   // ...

//   pool.query(sql, [searchKey, searchKey, searchKey, searchKey, searchKey], (err, result) => {
//     if (err) {
//       // ...
//     }

//     const similarUsers = calculateSimilarUsers(userId, searchHistory)
//       .sort((a, b) => b.similarity - a.similarity); // Sort similar users by similarity

//     const similarItems = calculateSimilarItems(result, key)
//       .filter(({ similarity }) => similarity > 0.5); // Filter items with low similarity

//     res.json({ result, similarUsers, similarItems });
//   });
// });

// // ...

// // Calculate Cosine similarity
// function calculateCosineSimilarity(item, key) {
//   const itemVector = getItemVector(item);
//   const keyVector = getKeyVector(key);
//   // ...
// }

// // Helper functions to get item and key vectors
// function getItemVector(item) {
//   // Implement this function to get the vector representation of an item
//   // For example, you could use the item's tags or keywords
//   return item.tags.split(' ').map(tag => tag.toLowerCase());
// }

// function getKeyVector(key) {
//   // Implement this function to get the vector representation of a key
//   // For example, you could use the key's individual words
//   return key.split(' ').map(word => word.toLowerCase());
// }

// User signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting a database connection:', err);
                return res.status(500).json({ msg: 'Database connection error', details: err });
            }

            const sqlCheck = 'SELECT * FROM newusers WHERE email = ?';
            connection.query(sqlCheck, [email], (error, result) => {
                if (error) {
                    connection.release();
                    return res.status(500).json({ msg: 'Error checking user', details: error });
                }

                if (result.length > 0) {
                    connection.release();
                    return res.status(403).json({ msg: 'User already exists' });
                }

                const sqlInsert = 'INSERT INTO newusers (name, email, password) VALUES (?, ?, ?)';
                connection.query(sqlInsert, [name, email, password], (error, result) => {
                    connection.release();
                    if (error) return res.status(500).json({ msg: 'Error inserting user', details: error });

                    res.status(201).json({ msg: 'User created successfully' });
                });
            });
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ msg: 'An error occurred', details: error });
    }
});

// User signin
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting a database connection:', err);
                return res.status(500).json({ msg: 'Database connection error', details: err });
            }

            const sql = 'SELECT * FROM newusers WHERE email = ? AND password = ?';
            connection.query(sql, [email, password], (error, result) => {
                connection.release(); // Always release the connection back to the pool after query execution

                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).json({ msg: 'Error executing query', details: error });
                }

                if (result.length > 0) {
                    const user = { id: result[0].id, name: result[0].name }; // User object with id and name
                    const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                    // Respond with the token, userId, and name
                    res.status(200).json({
                        msg: 'User logged in successfully',
                        token: accessToken,
                        userId: user.id,
                        name: user.name
                    });
                } else {
                    res.status(403).json({ msg: 'Invalid email or password' });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error during signin:', error);
        res.status(500).json({ msg: 'An unexpected error occurred', details: error });
    }
});


// Retrieve user profile
app.get('/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from token payload

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting a database connection:', err);
                return res.status(500).json({ msg: 'Database connection error', details: err });
            }

            const sql = "SELECT id, name, email FROM newusers WHERE id = ?";
            connection.query(sql, [userId], (error, result) => {
                connection.release();

                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).json({ msg: 'Error executing query', details: error });
                }

                if (result.length > 0) {
                    res.status(200).json({ msg: 'User profile retrieved successfully', user: result[0] });
                } else {
                    res.status(404).json({ msg: 'User not found' });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error during profile retrieval:', error);
        res.status(500).json({ msg: 'An unexpected error occurred', details: error });
    }
});

// Logout endpoint (if necessary, this example does not actually invalidate tokens)
app.post('/logout', (req, res) => {
    res.status(200).json({ msg: 'Logged out successfully' });
});


// Add file to library route
app.post("/add-to-library", authenticateToken, (req, res) => {
    // Extract user ID from the authenticated user object set by middleware
    const userId = req.user?.id;
    const { fileId } = req.body;
  
    // Log incoming request details for debugging
    console.log(`Received request to add file ${fileId} to library for user ${userId}`);
  
    // Check if userId and fileId are provided and valid
    if (!userId) {
      console.error("User ID not found in request. Authentication may have failed.");
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }
  
    if (!fileId) {
      console.error("No fileId provided in request body.");
      return res.status(400).json({ msg: "No fileId provided" });
    }
  
    // SQL query to add the file to the library
    const sql = "INSERT INTO library (user_id, item_id) VALUES (?, ?)";
  
    // Execute the query
    pool.query(sql, [userId, fileId], (err, result) => {
      // Log and respond appropriately based on the query result
      if (err) {
        console.error("Error adding file to library:", err);
  
        // Check if the error is related to duplicate entries (e.g., primary key or unique constraints)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ msg: "File is already in the library" });
        }
  
        // For any other errors, send a generic error response
        return res.status(500).json({
          msg: "An error occurred while adding the file to the library",
          details: err.message,
        });
      }
  
      // Successfully added file to library
      console.log(`File ${fileId} added to library for user ${userId}`);
      res.status(200).json({ msg: "File added to library successfully" });
    });
  });
  


// Get all files in the user's library
app.get('/library', authenticateToken, (req, res) => {
    const userId = req.user.id;
  
    const sql = `
      SELECT u.id, u.title, u.author, u.pdf, u.year, u.tags 
      FROM library l
      JOIN users u ON l.item_id = u.id
      WHERE l.user_id = ?
    `;
    pool.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error retrieving library:', err);
        return res.status(500).json({ msg: 'Error retrieving library', details: err });
      }
      res.status(200).json(result);
    });
  });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
