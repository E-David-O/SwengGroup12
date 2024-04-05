#!/bin/sh

pip3 install psycopg2 minio
python3 /app/app/db_tests.py
