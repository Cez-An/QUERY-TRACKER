import express from 'express';
import { connect } from 'mongoose';
import { join } from 'path';
import queryRoutes from './routes/queryRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

connect('mongodb://127.0.0.1:27017/query-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

app.use('/', queryRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
