const express = require('express');

const users = require('./routes/users');
const auth = require('./routes/auth');
const computers = require('./routes/computers');
const companies = require('./routes/companies');
const positions = require('./routes/positions');
const placements = require('./routes/placements');
const errorHandler = require('./middleware/error');

const app = express();

app.use(express.json({ extended: false }));

app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/api/v1/computers', computers);
app.use('/api/v1/companies', companies);
app.use('/api/v1/positions', positions);
app.use('/api/v1/placements', placements);

app.use(errorHandler);

module.exports = app;
