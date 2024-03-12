import psycopg2

def connect_to_database():
    try:
        # Change these values according to your PostgreSQL configuration
        connection = psycopg2.connect(
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432",
            database="DB"
        )
        cursor = connection.cursor()
        return connection, cursor
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return None, None

def insert_data_into_table(data):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            # Change "your_table_name" to the actual name of your table
            postgres_insert_query = """ INSERT INTO identity (_name, surname) VALUES (%s,%s)"""
            # Adjust column names and data accordingly
            record_to_insert = (data['value1'], data['value2'])
            cursor.execute(postgres_insert_query, record_to_insert)
            connection.commit()
            cursor.execute("SELECT * FROM identity;")
            print("Data inserted successfully into the table")
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert data into PostgreSQL table", error)
    finally:
        if connection:
            cursor.close()
            connection.close()

# Example data, replace with your actual data
data_to_insert = {
    'value1': 'Eimhin',
    'value2': 'Heenan-Roberts',
}

# Insert the example data into the PostgreSQL table
insert_data_into_table(data_to_insert)
