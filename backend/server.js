const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes'); // <-- add this
const notesRoutes = require('./routes/noteRoutes');
dotenv.config();
connectDB();

const app = express();
// app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/notes', notesRoutes);




app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
