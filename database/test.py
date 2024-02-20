import psycopg2

def connect_to_database():

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
            cursor.execute("""INSERT INTO Image_Metadata (id_video) VALUES (10);""")
            cursor.execute("""SELECT * FROM Image_Metadata;""")

            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert data into PostgreSQL table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


setup_tables()