import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import servicesRoutes from './services/index.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(cors());
app.use(express.json());

// adding the services endpoint in main index.js file
app.use('/services', servicesRoutes);

// testing whether the server is working
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// connecting mongodb
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));