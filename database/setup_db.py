# Run in terminal cd into the SwEng folder
# start up
# docker-compose build && docker-compose up -d
# tear down
# docker-compose down

# install psycopg2-binary



import psycopg2
import time
def connect_to_database():

    time.sleep(5)

    try:
        # Change these values according to your PostgreSQL configuration
        connection = psycopg2.connect(
            user="postgres",
            password="postgres",
            host="172.20.0.10",
            #host="localhost",
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
            
            # Setting up the Image metadata table   
            cursor.execute("""CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                username VARCHAR(255) NOT NULL,
                _password VARCHAR(255) NOT NULL,
                json_auth_token VARCHAR(255) NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS Videos (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_account INT,
                videoLink VARCHAR(255) NOT NULL,
                videoPath VARCHAR(255),
                fileFormat VARCHAR(255),
                frameRate INT,
                videoLength VARCHAR(255),
                frame_resolution VARCHAR(255),
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS SelectedFrame (
                id INT,
                id_video INT,
                frameNumber INT,
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS AnalyzedFrames (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_image VARCHAR(255),
                objectDetected VARCHAR(255),
                confidence FLOAT,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS AccessLog (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                _success BOOL NOT NULL,
                id_account INT NOT NULL REFERENCES User_Table (id),
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
    time.sleep(5)
    print("Start")
    setup_tables()
    print("Something")