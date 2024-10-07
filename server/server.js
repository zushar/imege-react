// Server File: server.js
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

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
        console.error("Database connection error: ", error);
    }
}

// Endpoint to get paginated people images data from the database
app.get('/api/people', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    console.log(`Received request to get people data: page=${page}, limit=${limit}`);
    try {
        const [rows] = await connection.query(
            'SELECT id, name, birth_date, death_date, gib_2021_numbers_only, old_pics_2020_numbers_only, pics_stop_numbers_only, good_pics FROM people_images LIMIT ? OFFSET ?',
            [limit, offset]
        );
        console.log(`Successfully fetched ${rows.length} people from the database.`);
        res.json(rows);
    } catch (error) {
        if(error.message.includes('connection is in CLOSED state')) {
            await connectToDatabase();
            // Retry the query after re-connecting to the database
            const [rows] = await connection.query(
                'SELECT id, name, birth_date, death_date, gib_2021_numbers_only, old_pics_2020_numbers_only, pics_stop_numbers_only, good_pics FROM people_images LIMIT ? OFFSET ?',
                [limit, offset]
            );
            console.log(`Successfully fetched ${rows.length} people from the database.`);
            res.json(rows);
        } else {
        console.error("Error fetching people data: ", error.message);
        res.status(500).json({ error: error.message });
        }
    }
});

// Endpoint to set the "good" image for a person
app.post('/api/set-good-pic', async (req, res) => {
    const { id, imagePath } = req.body; // Extract id and image path from request
    console.log(`Received request to set good image for person ID: ${id}, imagePath: ${imagePath}`);
    try {
        await connection.query(
            'UPDATE people_images SET good_pics = ? WHERE id = ?',
            [imagePath, id]
        );
        console.log(`Successfully updated good image for person ID: ${id}`);
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating good image: ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to delete an image path from the database
app.post('/api/delete-path', async (req, res) => {
    const { id, column } = req.body; // Extract id and column name from request body
    console.log(`Received request to delete image path for person ID: ${id}, column: ${column}`);
    try {
        await connection.query(
            `UPDATE people_images SET ${column} = NULL WHERE id = ?`,
            [id]
        );
        console.log(`Successfully deleted image path for person ID: ${id}, column: ${column}`);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting image path: ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server and connect to the database
app.listen(5000, async () => {
    await connectToDatabase();
    console.log('Server is running on http://localhost:5000');
});