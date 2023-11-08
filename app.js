const express = require('express');
const fs = require('fs');
const app = express();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const pool = new Pool(dbConfig);

app.use(express.json());
app.use('/import-data', (req, res, next) => {
  // Read the CSV file
  const csvFilePath = process.env.CSV_FILE_PATH;

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Split the CSV data into lines and get the header and rows
    const lines = data.split('\n');
    const header = lines[0].split(',').map((item) => item.trim());
    const jsonArray = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((item) => item.trim());
      const rowData = {};

      for (let j = 0; j < header.length; j++) {
        const keys = header[j].split('.');
        let currentObject = rowData;

        for (let k = 0; k < keys.length - 1; k++) {
          if (!currentObject[keys[k]]) {
            currentObject[keys[k]] = {};
          }
          currentObject = currentObject[keys[k]];
        }

        currentObject[keys[keys.length - 1]] = row[j];
      }

      jsonArray.push(rowData);
    }

    // Save the JSON data to a file
    fs.writeFileSync('output.json', JSON.stringify(jsonArray, null, 2));
    next();
  });
});


app.post('/import-data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('output.json', 'utf8'));
    data.forEach(async (item) => {
      // Extract data for the first part (id, firstname, lastname, age, and address)
      const { name, age, address, ...additional_info } = item;

      const query = {
        text: 'INSERT INTO public.users(id, firstname, lastname, age, address, additional_info) VALUES(DEFAULT, $1, $2, $3, $4, $5)',
        values: [
          name.firstName,
          name.lastName,
          parseInt(age),
          JSON.stringify(address), // Map the address object
          JSON.stringify(additional_info), // Map the remaining data into additionalInfo
        ],
      };

      await pool.query(query);
    });

    res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  });

  app.get('/calculate-age-distribution', (req, res) => {
    // Query to retrieve age data
    const query = 'SELECT age FROM public.users';
    pool.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.message });
        return;
      }
  
      const rows = result.rows;
      const totalUsers = rows.length;
  
      // Initialize ageGroups with 0 counts
      const ageGroups = {
        '<20': 0,
        '20 to 40': 0,
        '40 to 60': 0,
        '>60': 0,
      };
  
      if (totalUsers === 0) {
        res.status(200).json({ message: 'No users in the database.' });
      } else {
        rows.forEach((row) => {
          const age = row.age;
          if (age < 20) {
            ageGroups['<20']++;
          } else if (age >= 20 && age <= 40) {
            ageGroups['20 to 40']++;
          } else if (age > 40 && age <= 60) {
            ageGroups['40 to 60']++;
          } else {
            ageGroups['>60']++;
          }
        });
  
        // Prepare and send the age distribution report as JSON
        console.log('Age Group   % Distribution');
      for (const group in ageGroups) {
        const percentage = ((ageGroups[group] / totalUsers) * 100).toFixed(2);
        console.log(`${group}        ${percentage}%`);
      }
      const ageDistributionReport = {};
      for (const group in ageGroups) {
        const percentage = ((ageGroups[group] / totalUsers) * 100).toFixed(2);
        ageDistributionReport[group] = `${percentage}%`;
      }
      res.status(200).json(ageDistributionReport);
      server.close(() => {
        console.log('Server closed');
      });
      }
    });
  });
// Start the server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
