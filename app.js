import express from 'express';
import { join } from 'path';
import dotenv from "dotenv"
import connectDB from './config/db.js';
import queryRoutes from './routes/queryRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

app.set('view engine', 'ejs');

app.use('/', queryRoutes);

app.listen(process.env.PORT || 3000, () => console.log(`
  Server running on http://localhost:3000`));
