-- Step 1: Drop the foreign key constraints from the transactions and portfolio tables
ALTER TABLE transactions DROP FOREIGN KEY transactions_ibfk_1;
ALTER TABLE portfolio DROP FOREIGN KEY portfolio_ibfk_1;

-- Step 2: Drop the tables if they exist
DROP TABLE IF EXISTS portfolio;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS users;

-- Step 3: Drop the database if it exists
DROP DATABASE IF EXISTS financial_portfolio;
