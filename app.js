const express = require('express');
const csvtojson = require('csvtojson');
const fs = require('fs');
const app = express();
const { Pool } = require('pg');
const http = require('http');
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

// Start the server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Import data automatically on server start
  try {
    await importData();
    console.log('Data imported successfully.');

    // Calculate age distribution automatically on server start
    const ageDistribution = await calculateAgeDistribution();

    // Close the server after printing the report
    server.close(() => {
      console.log('Server closed.');
      
      // Stop the application
      process.exit(0);
    });
  } catch (error) {
    console.error('Error:', error);
    
    // If there's an error, stop the application
    process.exit(1);
  }
});


async function importData() {
  const jsonArray = await csvtojson().fromFile(process.env.CSV_FILE_PATH);
  fs.writeFileSync('output.json', JSON.stringify(jsonArray, null, 2));
  const data = JSON.parse(fs.readFileSync('output.json', 'utf8'));

  for (const item of data) {
    const { name, age, address, ...additional_info } = item;
    const query = {
      text: 'INSERT INTO public.users(id, firstname, lastname, age, address, additional_info) VALUES(DEFAULT, $1, $2, $3, $4, $5)',
      values: [
        name.firstName,
        name.lastName,
        parseInt(age),
        JSON.stringify(address),
        JSON.stringify(additional_info),
      ],
    };
    await pool.query(query);
  }
}

async function calculateAgeDistribution() {
  const query = 'SELECT age FROM public.users';
  const result = await pool.query(query);

  const rows = result.rows;
  const totalUsers = rows.length;

  const ageGroups = {
    '<20': 0,
    '20 to 40': 0,
    '40 to 60': 0,
    '>60': 0,
  };

  if (totalUsers === 0) {
    return { message: 'No users in the database.' };
  }

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

  console.log('Age Group   % Distribution');
    for (const group in ageGroups) {
      const percentage = ((ageGroups[group] / totalUsers) * 100).toFixed(2);
      console.log(`${group}        ${percentage}%`);
    }
}
