CREATE OR REPLACE FUNCTION update_updated_at_column()

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'generative_ai') THEN
    CREATE DATABASE generative_ai;
  END IF;
END
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

\c generative_ai;

CREATE TABLE users(
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
    status boolean,
    address2 varchar NOT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    deleted_at timestamp,
    PRIMARY KEY (id)
);