CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT uuid_generate_v4(),
    email varchar UNIQUE NOT NULL,
    password varchar NOT NULL,
    username varchar UNIQUE NOT NULL,
    firstname varchar NOT NULL,
    lastname varchar NOT NULL,
    state varchar NOT NULL,
    city varchar NOT NULL,
    country varchar NOT NULL,
    address1 varchar NOT NULL,
    address2 varchar NOT NULL,
    status boolean,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    deleted_at timestamp,
    PRIMARY KEY (id)
);

-- Add a trigger to update the `updated_at` column
CREATE OR REPLACE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

