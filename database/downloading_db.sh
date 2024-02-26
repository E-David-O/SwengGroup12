#!/bin/bash

# Define variables
CONTAINER_NAME="db"
BACKUP_DIR="/Users/eimhin/Desktop/SwengGroup12/database/database_backup" # This is for the path to backup directory
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_FILE="$BACKUP_DIR/postgres_backup_$TIMESTAMP.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup PostgreSQL data
docker exec -t $CONTAINER_NAME pg_dumpall -c -U postgres > $BACKUP_DIR/dump.sql
docker cp $CONTAINER_NAME:/var/lib/postgresql/data $BACKUP_DIR/pg_data

# Compress backup files
tar -zcvf $BACKUP_FILE -C $BACKUP_DIR .

# Clean up temporary files
rm -rf $BACKUP_DIR/dump.sql $BACKUP_DIR/pg_data

echo "Backup completed: $BACKUP_FILE"
