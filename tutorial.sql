-- This script creates a PostgreSQL database and a table named 'users' with some sample data.
CREATE DATABASE gdlhub_db;

-- List all databases to confirm the creation of 'gdlhub_restaurants' 
\l

-- Connect to the newly created database
-- NOTE: Only run this command in the psql shell, not in a script.
\c gdlhub_db

-- List all tables in the current database to confirm the connection
\dt

-- Create a table named 'users' with the following columns:
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data into the 'users' table
INSERT INTO users (name, email) 
VALUES 
  ('John Doe', 'john@gmail.com'), 
  ('Jane Doe', 'jane@gmail.com');

-- Select all records from the 'users' table to verify the data insertion
\dt             -- Ver tablas
SELECT * FROM users;
SELECT * FROM restaurants;
