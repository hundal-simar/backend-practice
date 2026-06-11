const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoute');
const commentRoutes = require('./routes/commentRoute');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'taskmanager'

}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000' || process.env.CLIENT_URL,
    credentials: true
}))

app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));


app.use(express.json());

//app.use(xss());
//app.use(mongoSanitize());
app.use(hpp({whitelist: ['sort', 'fields']}));

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