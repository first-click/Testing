const express = require('express');
const dotenv = require('dotenv');
const users = require('./routes/users')


// Load env vars
dotenv.config({ path: './config/config.env' });


const app = express();

app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/api/v1/users', users)

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

