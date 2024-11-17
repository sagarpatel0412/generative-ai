#!/bin/bash

ENV_FILE="../.env"


if [ -f "$ENV_FILE" ]; then
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
else
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi


REQUIRED_VARS=("DB_USERNAME" "DB_PASSWORD" "DB_HOST" "DB_PORT" "DB_NAME")
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Environment variable $var is not set."
    exit 1
  fi
done


read -p "Are you sure you want to delete the database '$DB_NAME'? (y/n): " confirm
if [[ "$confirm" != "y" ]]; then
  echo "Operation canceled. Database was not deleted."
  exit 1
fi

if PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1; then

  echo "Disconnecting active connections to the database $DB_NAME..."
  PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME';"


  echo "Dropping database $DB_NAME..."
  PGPASSWORD="$DB_PASSWORD" psql -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" -c "DROP DATABASE $DB_NAME;"

  echo "Database $DB_NAME deleted successfully."
else
  echo "Error: Database $DB_NAME does not exist."
  exit 1
fi
