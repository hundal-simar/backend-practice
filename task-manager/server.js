const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoute');
const commentRoutes = require('./routes/commentRoute');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'taskmanager'

}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/comments', commentRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});