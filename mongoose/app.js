const express = require('express');
const mongoose = require('mongoose');


const postRoutes = require('./routes/postRoutes');
const authorRoutes = require('./routes/authorRoutes');

const connectDB = require('./db');
connectDB();

const app = express();


app.use(express.json());
app.use('/authors', authorRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});