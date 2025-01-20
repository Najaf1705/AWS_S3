import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import s3Routes from './routes/s3Routes.js';

dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Mount routes
app.use('/s3', s3Routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
