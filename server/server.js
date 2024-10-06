// Server File: server.js
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS to allow requests from different origins
app.use(express.json()); // Parse incoming JSON requests

let connection;

// Function to connect to the MySQL database
async function connectToDatabase() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345678',
            database: 'bazach_hebrew',
            port: 3306,
        });
        console.log("Connected to the database.");
    } catch (error) {
        console.error("Database connection error: ", error); // Log any connection errors
    }
}

// Endpoint to get paginated people images data from the database
app.get('/api/people', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await connection.query(
            'SELECT id, name, birth_date, death_date, gib_2021_numbers_only, old_pics_2020_numbers_only, pics_stop_numbers_only FROM people_images LIMIT ? OFFSET ?',
            [limit, offset]
        );
        res.json(rows); // Send the retrieved data as JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors and send error message
    }
});

// Endpoint to delete an image path from the database
app.post('/api/delete-path', async (req, res) => {
    const { id, column } = req.body; // Extract the id and column name from the request body
    try {
        await connection.query(
            `UPDATE people_images SET ${column} = NULL WHERE id = ?`,
            [id]
        );
        res.json({ success: true }); // Send success response
    } catch (error) {
        res.status(500).json({ success: false, error: error.message }); // Handle errors and send error message
    }
});

// Start the server and connect to the database
app.listen(5000, async () => {
    await connectToDatabase();
    console.log('Server is running on http://localhost:5000');
});