#!/bin/bash
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

if psql -U "$DB_USERNAME" -d "$DB_NAME" -h "$DB_HOST" -p "$DB_PORT" -w -f "$SQL_FILE" <<< "$DB_PASSWORD"; then
  echo "SQL script executed successfully!"
else
  echo "Error executing SQL script."
fi