#!/bin/bash

# Define variables
CONTAINER_NAME="db"
BACKUP_FILE="/Users/eimhin/Desktop/SwengGroup12/database/database_backup/postgres_backup_20240214134451.tar.gz"

# Copy backup file to container
docker cp $BACKUP_FILE $CONTAINER_NAME:/tmp/postgres_backup.tar.gz

# Restore database backup
docker exec -it $CONTAINER_NAME sh -c 'tar -xzvf /tmp/postgres_backup.tar.gz -C /tmp && psql -U postgres -c "DROP DATABASE db;"'
docker exec -it $CONTAINER_NAME sh -c 'psql -U postgres -c "CREATE DATABASE db;"'
docker exec -it $CONTAINER_NAME sh -c 'psql -U postgres -d db -f /tmp/dump.sql'

echo "Database backup restored successfully!"
