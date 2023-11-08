### csvToJson
This code sets up an Express server, imports data from a CSV file into a PostgreSQL database, calculates age distribution, and then closes the server.
1] Before running this code make sure you have created the database in postgreSQL.<br>
2] Create table 'public.users' under this database with following columns:
    { id serial4 NOT NULL,
    firstName varchar NOT NULL,
    lastName varchar NOT NULL,
    age int4 NOT NULL,
    address jsonb NULL,
    additional_info jsonb NULL,
    name varchar GENERATED ALWAYS AS (firstName || ' ' || lastName) STORED }
3] Open .env file and provide required details as per your database configuration.
4] Open data.csv file and make changes accordingly (add or remove rows).
5] Open cmd and go to the project directory and run command 'node app.js'.A server will start on port 3000.
6] Once the server is running, you can access the endpoints as described in code:
To import data from the CSV file, you can make a POST request to http://localhost:3000/import-data
--this will convert csv file to json file and import data into the database.
(In Postman or similar tools, create a new request, set the HTTP method to POST, and enter the URL (e.g., http://localhost:3000/import-data).)
To calculate the age distribution, you can make a GET request to http://localhost:3000/calculate-age-distribution
--This will print age distribution report in console.
((In Postman or similar tools, create a new request, set the HTTP method to GET, and enter the URL (e.g., http://localhost:3000/calculate-age-distribution).))

