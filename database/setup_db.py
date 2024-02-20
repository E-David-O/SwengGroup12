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
            # host="172.20.0.10",
            host="localhost",
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
            cursor.execute("""CREATE TABLE IF NOT EXISTS Image_Metadata (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_video INT NOT NULL,
                frame_resolution VARCHAR(255) NOT NULL DEFAULT '1920x1080',
                _timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS Analyzed_Frames (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                id_image VARCHAR(255) NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS User_Table (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                json_auth_token VARCHAR(255) NOT NULL,
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("""CREATE TABLE IF NOT EXISTS Access_Table (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                _success BOOL NOT NULL,
                id_account VARCHAR(255),
                _timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );""")

            cursor.execute("SELECT * FROM Access_Table;")

            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert data into PostgreSQL table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


if __name__ == "__main__" :
    print("Start")
    setup_tables()
    print("Something")