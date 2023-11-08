## csvToJson
This code sets up an Express server, imports data from a CSV file into a PostgreSQL database, calculates age distribution, and then closes the server.
## Prerequisites
1. **Database Setup:** Make sure you have created a PostgreSQL database.

2. **Table Creation:** Create a table named `public.users` in the database with the following columns:
   - `id serial4 NOT NULL`
   - `firstName varchar NOT NULL`
   - `lastName varchar NOT NULL`
   - `age int4 NOT NULL`
   - `address jsonb NULL`
   - `additional_info jsonb NULL`
   - `name varchar GENERATED ALWAYS AS (firstName || ' ' || lastName) STORED`

3. **.env Configuration:** Open the .env file and provide the required details based on your database configuration.

4. **CSV Data:** Open the data.csv file and make any necessary changes (add or remove rows) to match your data.
5. Open cmd and go to the project directory and run command 'node app.js'.A server will start on port 3000.
The server will start on port 3000.

## Server Endpoints
Once the server is running, you can access the following endpoints as described in the code:

### Import Data from CSV
To import data from the CSV file, make a POST request to: http://localhost:3000/import-data
This endpoint will convert the CSV file to a JSON file and import the data into the database. You can use tools like Postman to make this request.

### Calculate Age Distribution
To calculate the age distribution, make a GET request to: http://localhost:3000/calculate-age-distribution
This endpoint will print the age distribution report in the console. Again, tools like Postman can be used to make this request.

Please ensure you've completed the setup and configuration steps before using the server and its endpoints.
