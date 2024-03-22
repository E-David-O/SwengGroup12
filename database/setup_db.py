# Run in terminal cd into the SwEng folder
# start up
# docker-compose build && docker-compose up -d
# tear down
# docker-compose down

# install psycopg2-binary



import psycopg2
import time

def connect_to_database():
    try:
        # Change these values according to your PostgreSQL configuration
        connection = psycopg2.connect(
            user="postgres",
            password="postgres",
            host="172.20.0.10",
            #host="localhost"
            port="5432",
            database="DB"
        )
        cursor = connection.cursor()
        return connection, cursor
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return None, None

def setup_tables():
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            # cursor.execute(""" 
            # DO $$ 
            #     BEGIN
            #         IF NOT EXISTS(SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'public') THEN
            #             CREATE SCHEMA public;
            #         END IF;
            # END $$;
            # """)
            cursor.execute("""CREATE EXTENSION IF NOT EXISTS citext; """)
            # Setting up the Image metadata table   
            cursor.execute("""CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                username CITEXT UNIQUE NOT NULL ,
                _password VARCHAR(60000) NOT NULL,
                jsonAuthToken VARCHAR(60000) NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS Videos (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                idAccount INT,
                videoPath VARCHAR(60000),
                fileFormat VARCHAR(60000),
                frameRate VARCHAR(60000),
                videoLength VARCHAR(60000),
                frame_resolution VARCHAR(60000),
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS SelectedFrame (
                id SERIAL UNIQUE PRIMARY KEY,
                idFrame INT,
                idVideo INT,
                frameNumber INT,
                selectionMethod INT,
                frameData BYTEA,
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS AnalyzedFrames (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                idFrame INT,
                objectDetected VARCHAR(60000),
                confidence FLOAT,
                framePath BYTEA,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS AccessLog (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                _success BOOL NOT NULL,
                idAccount INT NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert data into PostgreSQL table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


if __name__ == "__main__" :
    time.sleep(3)
    setup_tables()
    print("Table setup has been ran ")