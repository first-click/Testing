const express = require('express');

const users = require('./routes/users');
const auth = require('./routes/auth');
const errorHandler = require('./middleware/error');

const app = express();

app.use(express.json({ extended: false }));

app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

module.exports = app;