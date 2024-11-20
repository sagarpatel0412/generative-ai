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
    email varchar NOT NULL,
    password varchar NOT NULL,
    username varchar NOT NULL,
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

DROP INDEX IF EXISTS unique_email;
DROP INDEX IF EXISTS unique_username;

CREATE UNIQUE INDEX unique_email ON users (email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX unique_username ON users (username) WHERE deleted_at IS NULL;

-- Add a trigger to update the `updated_at` column
CREATE OR REPLACE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS user_chat_window (
  id uuid DEFAULT uuid_generate_v4(),
  user_id uuid,
  chat_name varchar NOT NULL,
  status boolean,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE OR REPLACE TRIGGER set_updated_at_chat_window
BEFORE UPDATE ON user_chat_window
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

