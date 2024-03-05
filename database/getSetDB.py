import psycopg2
import time
import json
import os
from minio import Minio
from minio.error import ResponseError
from datetime import datetime

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

def connect_to_minio():
    try:
        minio_client = Minio(
            #"172.20.0.50:9000",
            "localhost:9000",
            access_key="minioConnect"
            secret_key="connectMinio",
            secure=False
        )
        return minio_client
    except ResponseError as error
        print("MinIO error: ", error)
        return None

def sendVideoToBucket():
    try:
        connection, cursor = connect_to_database()
        if connection and cursor
            try:
                minio_client = connect_to_minio()
                if minio_client:
                    video_path = "/testVideo.mp4"
                    # timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  # Format timestamp
                    # new_file_name = f"video_{timestamp}{extension}" 
                    # os.rename(video_path, new_file_name)
                    video_name = os.path.basename(video_path)

                    bucket_name = "videos"
                    minio_client.fput_object(bucket_name, video_name, video_path)

                    video_url = minio_client.presigned_get_object(bucket_name, video_name)

                    cursor.execute("""INSERT INTO Videos
                                (id_account, videoLink, videoPath, fileFormat, frameRate, videoLength, frame_resolution) 
                                VALUES (1, %s, %s, 'mp4', 30, '1 hour', '1920x1080')""", (video_url, video_path))
                    connection.commit()

        except(Exception, psycopg2.Error, ResponseError) as error:
            if connection:
                print("Error: ", erorr)
        finally:
            if connection:
                cursor.close()
                connection.close()



# For testing the database on docker with github actions
def testing_database_github():
    testing_str = "testing for github"
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            cursor.execute("""CREATE TABLE IF NOT EXIST TestingDB (
                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                testTimestamp TIMESTAMP DEFUALT CURRENT_TIMESTAMP,
                testValue VARCHAR(60000)
            );""")

            cursor.execute(""" INSERT INTO TestingDB (testValue) VALUES(%s);""", testing_str)

            cursor.execute("""SELECT * FROM TestingDB WHERE testValue = %s;""", testing_str)

            rows = cursor.fetchall()

            cursor.execute("""DROP TABLE TestingDB;""")

            count = 0
            for row in rows:
                count = count + 1
            if count == 1:
                return True
            else:
                return False
        except (Exception, psycopg2.Error) as error:
            if connection:
                print("Error with trying to test the database, but was able to connect: ", error)
                return False
        finally:
            if connection:
                connection.commit()
                cursor.close()
                connection.close()

#image metadata set get
def set_image_metadata(vid_id, frame_res):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Insert image into table
            insert_query = """INSERT INTO Image_Metadata (id_video, frame_resolution)
                              VALUES (%s, %s);"""
            
            cursor.execute(insert_query, (vid_id, frame_res))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert video into PostgreSQL table Image_Metadata", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()    

def get_image_metadata(vid_id):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM Image_Metadata WHERE video_id=%s;"""
            
            cursor.execute(get_query, (vid_id))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get images using video ID from PostgreSQL table Image_Metadata", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def get_image_metadata(id):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM Image_Metadata WHERE id=%s;"""
            
            cursor.execute(get_query, (id))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get images using serial ID from PostgreSQL table Image_Metadata", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

#analyzed frames set get
def set_analyzed_frames(id_image):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Insert frame into table
            insert_query = """INSERT INTO Analyzed_Frames (id_image)
                              VALUES (%s);"""
            
            cursor.execute(insert_query, (id_image))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert frames using image ID into PostgreSQL table Analyzed_Frames", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def get_analyzed_frams(id_image):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM Analyzed_Frames WHERE id_image=%s;"""
            
            cursor.execute(get_query, (id_image))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get frame with image ID from PostgreSQL table Analyzed_Frames", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def get_analyzed_frams(id):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM Analyzed_Frames WHERE id=%s;"""
            
            cursor.execute(get_query, (id))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get frame with serial ID from PostgreSQL table Analyzed_Frames", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

#User Table set get
def set_User_Table(username, _password, json):

    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Insert image into table
            insert_query = """INSERT INTO User_Table (username, _password, json_auth_token)
                              VALUES (%s, %s, %s);"""
            
            cursor.execute(insert_query, (username, password, json))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert user into PostgreSQL table User_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()    

def get_User_Table(username):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM User_Table WHERE username=%s;"""
            
            cursor.execute(get_query, (username))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get user with username from PostgreSQL table User_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def get_User_Table(id):

    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM User_Table WHERE id=%s;"""
            
            cursor.execute(get_query, (id))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get user with serial ID from PostgreSQL table User_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

#Access Table set get
def set_Access_Table(_success, id_account):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Insert image into table
            insert_query = """INSERT INTO Access_Table (_success, id_account)
                              VALUES (%s, %s);"""
            
            cursor.execute(insert_query, (_success, id_account))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to insert access into PostgreSQL table Access_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()    

def get_Access_Table(id):

    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM Access_Table WHERE id=%s;"""
            
            cursor.execute(get_query, (id))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get user with serial ID from PostgreSQL table Access_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def get_Access_Table(id_account):
    
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            # Get image from table
            get_query = """SELECT * FROM Access_Table WHERE id_account=%s;"""
            
            cursor.execute(get_query, (id_account))
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get user with account ID from PostgreSQL table Access_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

#Enter either as -1 to leave blank
def get_Access_Table(lb, ub):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            if lb!=-1 and ub != -1:
                # Get image from table
                get_query = """SELECT * FROM Access_Table WHERE _timestamp >= '%s' AND _timestamp <= '%s';"""
                
                cursor.execute(get_query, (lb, ub))
            
            elif lb!=-1:
                # Get image from table
                get_query = """SELECT * FROM Access_Table WHERE _timestamp >= '%s';"""
                
                cursor.execute(get_query, (lb))

            elif ub != -1:
                # Get image from table
                get_query = """SELECT * FROM Access_Table WHERE _timestamp <= '%s';"""
                
                cursor.execute(get_query, (ub))

            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get user(s) with timestamp from PostgreSQL table Access_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def returnVideoData(video_id):
    
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            cursor.execute("""
                SELECT v.id, v.id_account, v.videoLink, v.videoPath, v.fileFormat, v.frameRate, v.videoLength, v.frame_resolution,
                sf.frameNumber,
                af.objectDetected, af.confidence
                FROM Videos v
                LEFT JOIN SelectedFrame sf ON v.id = sf.id_video
                LEFT JOIN AnalyzedFrames af ON sf.id = af.id_image
                WHERE v.id = %s;
            """, (video_id,))

            rows = cursor.fetchall()

            video_data = {}
            for row in rows:
                if row[0] not in video_data:
                    video_data[row[0]] = {
                        'id_account': row[1],
                        'videoLink': row[2],
                        'videoPath': row[3],
                        'fileFormat': row[4],
                        'frameRate': row[5],
                        'videoLength': row[6],
                        'frame_resolution': row[7],
                        'frames': []
                    }
                frame_number = row[8]
                if frame_number is not None:
                    frame_data = {
                        'frame_no': frame_number,
                        'objects': []
                    }
                    if row[9] is not None:
                        frame_data['objects'].append({
                            'found': row[9],
                            'confidence': row[10]
                        })
                    video_data[row[0]]['frames'].append(frame_data)
                    
            json_output = json.dumps(list(video_data.values()), indent=4)
            return json_output
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Failed to get user with account ID from PostgreSQL table Access_Table", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


