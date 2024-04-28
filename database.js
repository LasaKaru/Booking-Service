const { Sequelize } = require('sequelize'); // Importing necessary modules

const sequelize = new Sequelize( // Creating a new Sequelize instance for database connection
  process.env.DB_NAME, // Using environment variables for database name
  process.env.DB_USER, // Using environment variables for database user
  process.env.DB_PASSWORD, // Using environment variables for database password
  {
    host: process.env.DB_HOST, // Using environment variables for database host
    dialect: 'mysql', // Specifying the dialect as MySQL
    port: process.env.DB_PORT, // Using environment variables for database port
  }
);

sequelize.authenticate().then(() => { // Authenticating the connection to the database
  console.log('Connection has been established successfully.'); // Log success message if connection is established
}).catch(err => { // Handling errors during authentication
  console.error('Unable to connect to the database:', err); // Log error message if unable to connect
});

module.exports = sequelize; // Exporting the sequelize instance for use in other parts of the application

