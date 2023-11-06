### csvToJson
This code sets up an Express server, imports data from a CSV file into a PostgreSQL database, calculates age distribution, and then closes the server.
1] Before running this code make sure you have created the database in postgreSQL.
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
5] After running this code a new json file will be created named 'output.json' and data from 'data.csv' file will be overwrite in this output.json file. At the same time data will be imported into the table public.users that is created earlier.

