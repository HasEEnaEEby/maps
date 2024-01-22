const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors()); 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nothing',
  database: 'Byway',
});

connection.connect();

app.post('/api/saveLocation', (req, res) => {
    const { location_name, longitude, latitude } = req.body;
  
    console.log('Received request to save location:', { location_name, longitude, latitude });
  
    const sql = 'INSERT INTO maps (location_name, longitude, latitude) VALUES (?, ?, ?)';
    connection.query(sql, [location_name, longitude, latitude], (err, result) => {
      if (err) {
        console.error('Error saving location:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Location saved successfully');
        res.status(200).send('Location saved successfully');
      }
    });
  });

  app.get('/api/getLocations', (req, res) => {
    const sql = 'SELECT * FROM maps';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching locations:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(result);
      }
    });
  });  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
