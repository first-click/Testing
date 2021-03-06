const express = require('express');

const users = require('./routes/users');
const auth = require('./routes/auth');

const companies = require('./routes/companies');
const positions = require('./routes/positions');
const persons = require('./routes/persons');
const postings = require('./routes/postings');

const errorHandler = require('./middleware/error');

const app = express();

app.use(express.json({ extended: false }));

app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.use('/api/v1/companies', companies);
app.use('/api/v1/positions', positions);
app.use('/api/v1/persons', persons);
app.use('/api/v1/postings', postings);

app.use(errorHandler);

module.exports = app;
