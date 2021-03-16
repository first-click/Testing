const app = require('./app');
const dotenv = require('dotenv');

// require('./utils/logOrigin');

// Load env vars
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;

// const server = app.listen(
//   PORT,
//   console.log(
//     `Server running in ${
//       process.env.NODE_ENV || 'development'
//     } mode on port ${PORT}`
//   )
// );

app.listen(
  PORT,
  console.log(
    `Server running in ${
      process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  )
);

// Funktioniert nicht richtig. Fehlermeldung: "server is not defined"
// es müsste oben heißen const server = app.listen usw.
// das funktioniert aber auch nicht
// hier wird beschrieben, wie es funktioniert:
// https://stackoverflow.com/questions/43003870/how-do-i-shut-down-my-express-server-gracefully-when-its-process-is-killed

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  // console.log('unhandled Rejection');
  // console.log(err);
  // console.log(promise);
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
