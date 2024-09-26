const express = require('express');
const app = express();
require('dotenv').config();
const mysql = require('mysql2');

// Setup database connection
const db = mysql.createPool({
    host: process.env.localhost,
    user: process.env.root,
    password: process.env.Chancy01,
    database: process.env.hospital_db,
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
    connection.release();
});

//// Question 1 Retrieve all patients
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// // Question 2 Retrieve all providers
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// // Question 3 Filter patients by first name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(sql, [first_name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// // Question 4 Retrieve providers by specialty
app.get('/providers/filter', (req, res) => {
    const { specialty } = req.query;
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});