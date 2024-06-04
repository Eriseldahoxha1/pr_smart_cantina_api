const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors')



const app = express();
app.use(bodyParser.json());
app.use(cors())

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cantina_db'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Define a route to fetch data from MySQL database
app.get('/data', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Query the database
    connection.query('SELECT * FROM users', (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error querying MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Send the results as JSON
      res.json(results);
    });
  });
});

app.post('/users', (req, res) => {
  // Extract data from request body
  const { first_name, last_name, email } = req?.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Insert user data into the database
    connection.query('INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)', [first_name, last_name, email], (error, results) => {
      console.log(results)
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Send success response
      res.status(201).json({ message: 'User data inserted successfully' });
    });
  });
});

app.put('/users/:id',  (req, res)=>{
  const { first_name, last_name, email } = req?.body;
  console.log(req.body)
  const userId = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Insert user data into the database
    connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?', [first_name, last_name, email, userId], (error, results) => {
      // Release the connection
      connection.release();
      console.log(results)
      if (results?.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Send success response
      res.status(201).json({ message: 'User data updated successfully' });
    });
  });
})

app.delete('/users/:id',(req, res) =>{
  const userId = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Insert user data into the database
    connection.query('DELETE FROM users WHERE id = ?', [userId], (error, results) => {
      // Release the connection
      connection.release();
      console.log(results)
      if (results?.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Send success response
      res.status(201).json({ message: 'User deleted  successfully' });
    }); 
  });
})
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
