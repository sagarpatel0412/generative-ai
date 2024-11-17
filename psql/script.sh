#!/bin/bash

set -e

ENV_FILE="../.env"
if [ -f "$ENV_FILE" ]; then
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
else
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

REQUIRED_VARS=("DB_USERNAME" "DB_NAME" "DB_HOST" "DB_PORT" "DB_PASSWORD" "SQL_FILE")
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Environment variable $var is not set."
    exit 1
  fi
done

check_database_exists() {
  PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1
}

if ! check_database_exists; then
  echo "Database $DB_NAME does not exist. Creating database..."
  PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" -tAc "CREATE DATABASE \"$DB_NAME\";"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to create database $DB_NAME."
    exit 1
  fi
  echo "Database $DB_NAME created successfully."
else
  echo "Database $DB_NAME already exists."
fi

PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USERNAME" -d "$DB_NAME" -h "$DB_HOST" -p "$DB_PORT" -f "$SQL_FILE"
if [ $? -eq 0 ]; then
  echo "SQL script executed successfully!"
else
  echo "Error executing SQL script."
  exit 1
fi
