import psycopg2
import time
import json
import os
from minio import Minio
from datetime import datetime

def connect_to_database():
    try:
        # Change these values according to your PostgreSQL configuration
        connection = psycopg2.connect(
            user="postgres",
            password="postgres",
            #host="172.20.0.10",
            host="localhost",
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
            access_key="minioConnect",
            secret_key="connectMinio",
            secure=False
        )
        return minio_client
    except ResponseError as error:
        print("MinIO error: ", error)
        return None

def sendVideoToBucket():
    print("Enter")
    try:
        connection, cursor = connect_to_database()
        minio_client = connect_to_minio()
        if connection and cursor and minio_client:
            video_path = "./testing.mp4"
            # timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  # Format timestamp
            # new_file_name = f"video_{timestamp}{extension}" 
            # os.rename(video_path, new_file_name)
            video_name = os.path.basename(video_path)

            bucket_name = "videos"
            minio_client.fput_object(bucket_name, video_name, video_path)

            video_url = minio_client.presigned_get_object(bucket_name, video_name)
            print(video_url)

            cursor.execute("""INSERT INTO Videos
                        (id_account, videoLink, videoPath, fileFormat, frameRate, videoLength, frame_resolution) 
                        VALUES (1, %s, %s, 'mp4', 30, '1 hour', '1920x1080')""", (video_url, video_path))
            print("TEST")

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Error: ", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


def main():
    sendVideoToBucket()

if __name__ == "__main__":
    main()