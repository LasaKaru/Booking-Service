require('dotenv').config(); // Load environment variables from .env file

const { Sequelize } = require('sequelize'); // Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const Appointment = require('./appointmentModel'); // Importing the Appointment model

const app = express(); // Creating an Express application
const port = 8080; // Port number for the server to listen on

app.use(bodyParser.json()); // Adding middleware to parse JSON requests

// Sync Sequelize models with the database
Appointment.sequelize.sync().then(() => {
    console.log(`Database & tables created!`);
});

// Endpoint to get appointments
app.get('/appointments', async (req, res) => {
    try {
        const { upcoming, email } = req.query;
        let whereCondition = {};

        // If upcoming is true, filter appointments for the next 24 hours
        if (upcoming === 'true') {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            whereCondition.appointmentDate = {
                [Sequelize.Op.gte]: now,
                [Sequelize.Op.lt]: tomorrow,
            };
        }

        // Filter by email address if provided
        if (email) {
            whereCondition.email = email; 
        }

        // Fetch appointments based on the provided conditions
        const appointments = await Appointment.findAll({
            where: whereCondition,
            order: [['appointmentDate', 'ASC']], // Optionally, order by date
        });

        res.status(200).send(appointments); // Send fetched Bookings as response
    } catch (error) {
        console.error('Error fetching Bookings:', error);
        res.status(500).send(error);
    }
});

// Endpoint to get a specific Booking by ID
app.get('/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findOne({ where: { id } });

        // If Booking is not found, return 404 error
        if (!appointment) {
            return res.status(404).send({ message: 'Booking not found'});
        }

        res.status(200).send(appointment); // Send fetched Booking as response
    } catch (error) {
        console.error('Error fetching Booking:', error);
        res.status(500).send(error);
    }
});

// Endpoint to book a new Booking
app.post('/appointments', async (req, res) => {
    try {
        const { name, service, phoneNumber, email, appointmentDate } = req.body;
        const newAppointment = await Appointment.create({ name, service, phoneNumber, email, appointmentDate });
        res.status(201).send(newAppointment); // Send newly created Booking as response
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send(error);
    }
});

// Endpoint to update an existing Booking by ID
app.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, service, phoneNumber, email, appointmentDate } = req.body;

    try {
        const appointment = await Appointment.findOne({ where: { id } });

        // If Booking is not found, return 404 error
        if (!appointment) {
            return res.status(404).send({ message: 'Booking not found'});
        }

        // Update Booking fields with new values
        appointment.name = name;
        appointment.service = service;
        appointment.phoneNumber = phoneNumber;
        appointment.email = email;
        appointment.appointmentDate = appointmentDate;

        await appointment.save(); // Save the updated Booking
        res.status(200).send(appointment); // Send updated Booking as response
    } catch (error) {
        console.error('Error updating Booking:', error);
        res.status(500).send(error);
    }
});

// Endpoint to delete an Booking by ID
app.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Appointment.destroy({ where: { id } });

        // If no Booking is deleted, return 404 error
        if (result === 0) {
            return res.status(404).send({ message: 'Booking not found'});
        }

        res.status(200).send({ message: 'Booking deleted successfully'}); // Send success message
    } catch (error) {
        console.error('Error deleting Booking:', error);
        res.status(500).send(error);
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
