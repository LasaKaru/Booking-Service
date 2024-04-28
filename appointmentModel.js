const { DataTypes } = require('sequelize'); // Importing necessary modules
const sequelize = require('./database'); // Importing database connection

const Appointment = sequelize.define('Appointment', { // Defining a model named 'Appointment'
  name: { // Field for storing the name of the appointment
    type: DataTypes.STRING, // Data type is string
    allowNull: false, // Not nullable
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  // Other model options go here
});

module.exports = Appointment; // Exporting the Appointment model for use in other parts of the application
