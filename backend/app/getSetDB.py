import psycopg2
import time
import json
import os
from minio import Minio
from datetime import datetime
from psycopg2.extensions import Binary
import binascii


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


def connect_to_minio():
    try:
        minio_client = Minio(
            # "172.20.0.50:9000",
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
    try:
        connection, cursor = connect_to_database()
        minio_client = connect_to_minio()
        if connection and cursor and minio_client:
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
            

    except(Exception, psycopg2.Error) as error:
        if connection:
            print("Error: ", erorr)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


def set_user(username: str, password: str, json_auth_token: str):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            input_query = """INSERT INTO Users (username, _password, jsonAuthToken)
                        VALUES (%s, %s, %s);"""
            cursor.execute(input_query, (username, password, json_auth_token))
            return None
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to insert data: ", error)
            return error
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


def set_video(account_id: int, video_path: str, file_format: str, frame_rate: str, video_length: int,
              frame_resolution: str):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            input_query = """INSERT INTO Videos (idAccount, videoPath, fileFormat, frameRate, videoLength, frame_resolution)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id;"""
            cursor.execute(input_query,
                           (account_id, video_path, file_format, frame_rate, video_length, frame_resolution))
            inserted_id = cursor.fetchone()[0]
            return inserted_id
            
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to insert data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


def set_selected_frame(frame_id: int, video_id: int, frameNumber: int, selectionMethod: int, frameData: str):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            byte_array = frameData.encode('utf-8')
            binary_data = Binary(byte_array)

            input_query = """INSERT INTO SelectedFrame (idFrame, idVideo, frameNumber, selectionMethod, frameData) 
                        VALUES (%s, %s, %s, %s, %s);"""
            cursor.execute(input_query, (frame_id, video_id, frameNumber, selectionMethod, binary_data))

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Selected Frames")
            print("Could connect, but failed to insert data: ", error)
        else:
            print("Failed to connect: ", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


def set_analyzed_frames(idFrame: int, objectDetected: str, confidence: float, frameData: str):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            byte_array = frameData.encode('utf-8')
            binary_data = Binary(byte_array)
            input_query = """INSERT INTO AnalyzedFrames (idFrame, objectDetected, confidence, framePath)
                            VALUES (%s, %s, %s, %s)"""
            cursor.execute(input_query, (idFrame, objectDetected, confidence, binary_data))

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to insert data: ", error)
        else:
            print("Failed to connect: ", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def set_access_log(success: int, account_id: int):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

           print("")

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to insert data: ", error)
        else:
            print("Failed to connect: ", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


# Gets the user log in information
# parameter input -> username, user_id, is_username
# is_username specifies if we are using the username or user_id
# output is a json object
def get_user(username: str):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            input_query = """SELECT * FROM Users WHERE username = %s;"""
            cursor.execute(input_query, (username,))
            rows = cursor.fetchone()

            return json.dumps({
                "id" : rows[0],
                "username" : rows[1],
                "password" : rows[2],
                "jsonAuthToken" : rows[3],
                "datetime" : rows[4].strftime('%Y-%m-%d %H:%M:%S')
            })

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to insert data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


# Gets the information for the video
# parameter input -> video_id
# output is a json object
def get_video(video_id: int):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            input_query = """SELECT * FROM Videos WHERE id = '%s';"""
            cursor.execute(input_query, (video_id,))
            row = cursor.fetchone()
            # print(row)

            return json.dumps({
                "id": row[0],
                "idAccount": row[1],
                "videoPath": row[2],
                "fileFormat": row[3],
                "frameRate": row[4],
                "videoLength": row[5],
                "frameResolution": row[6],
                "timestamp": row[7].strftime('%Y-%m-%d %H:%M:%S')
            })
    except (Exception, psycopg2.Error) as error:
        if connection:
            print("get video")
            print("Could connect, but failed to insert data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close() 

# Gets the frames which are tied to a particular video
# parameter input -> video_id
# output is a json object
def get_selected_frames(video_id: int):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            input_query = """SELECT * FROM SelectedFrame WHERE idVideo = '%s';"""
            cursor.execute(input_query, (video_id,))
            
            data = cursor.fetchall()
            # print(data)
            rows = []
            for item in data:
                rows.append({
                    'id': item[0],
                    'idFrame': item[1],
                    'idVideo': item[2],
                    'frameNumber': item[3],
                    'selectionMethod': item[4],
                    'frameData': bytes(item[5]).decode('utf-8'),  # Convert memory address to string
                    'timestamp': item[6].strftime('%Y-%m-%d %H:%M:%S')  # Convert datetime to string
                })
            return json.dumps(rows, indent = 4)

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("get selected frames")
            print("Could connect, but failed to insert data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def get_analyzed_objects(frame_id: int):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            input_query = """SELECT * FROM AnalyzedFrames WHERE idFrame = '%s';"""
            cursor.execute(input_query, (frame_id,))

            data = cursor.fetchall()

            rows = []
            for item in data:
                rows.append({
                    "id": item[0],
                    "idFrame": item[1],
                    "objectDetected": item[2],
                    "confidence": item[3],
                    "boxedFrame": bytes(item[4]).decode('utf-8'),
                    "timestamp": item[5].strftime('%Y-%m-%d %H:%M:%S')
                })
            return json.dumps(rows)

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("get analyzed objects")
            print("Could connect, but failed to insert data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

# Returns a json object of the access log to see all login attempts
def get_access_log():
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            input_query = """SELECT * FROM AccessLog;"""
            cursor.execute(input_query)

            rows = cursor.fetchall()

            rows_as_dicts = []
            for row in rows:
                row_dict = dict(zip([col.name for col in cursor.description], row))
                for key, value in row_dict.items():
                    if isinstance(value, datetime):
                        row_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')
                rows_as_dicts.append(row_dict)
            json_data = json.dumps(rows_as_dicts)
            return json_data

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to insert data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

# def set_access_log(success: int, account_id: int)


def get_account_videos(account_id: int):
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            
            input_query = """SELECT * FROM Videos WHERE idAccount = '%s';"""
            cursor.execute(input_query, (account_id,))
            data = cursor.fetchall()
            rows = []
            for item in data:
                row = json.loads(return_all_video_info(item[0]))
                rows.append(row)
            return json.dumps(rows, indent = 4)

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to get data: ", error)
        else:
            print("Failed to connect: ", error)
    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

# def template(inputs):
#     try:
#         connection, cursor = connect_to_database()
#         if connection and cursor:
#
#            
#
#     except (Exception, psycopg2.Error) as error:
#         if connection:
#             print("Could connect, but failed to insert data: ", error)
#         else:
#             print("Failed to connect: ", error)
#     finally:
#         if connection:
#             connection.commit()
#             cursor.close()
#             connection.close()

def return_all_video_info(video_id: int):
    video_info = get_video(video_id)
    frames_info = get_selected_frames(video_id)
    
    if video_info is None:
        return None

    video_data = json.loads(video_info)
    frames_data = json.loads(frames_info)

    if frames_info is None:
        video_data["Frames"] = []
    else:
        video_data["Frames"] = frames_data

    for frame in video_data["Frames"]:
        frame_id = frame.get("idFrame")
        analyzed_objects_info = get_analyzed_objects(frame_id)
        analyzed_objects_data = json.loads(analyzed_objects_info)
        frame["Objects"] = analyzed_objects_data

    return json.dumps(video_data)


def main():
    # set_selected_frame(id: int, video_id: int, frameNumber: int, selectionMethod: int, frameData: bytes)
    # def set_analyzed_frames(idFrame: int, objectDetected: str, confidence: float, framePath: str)
    # def set_video(account_id: int, video_path: str, file_format: str, frame_rate: str, video_length: int, frame_resolution: str):

    # set_analyzed_frames(1, f"Apple {1}", .95, "Path to Frame")
    # json_data = get_analyzed_objects(1)
    # print(json_data)


    # set_video(0, "Video Path", "mp4", "60", 100, "1920x1080")

    # for i in range(5):
    #     set_selected_frame(i, 1, i * 3, 1, "Hello World")
    #     for j in range(5):
    #         set_analyzed_frames(i, f"Apple {j}", .95, "Path to Frame")
    # json_data = get_analyzed_objects(1)
    # print(json_data)
    # json_data = get_selected_frames(1)
    # print(json_data)
    json_data = get_account_videos(0)
    # json_data = return_all_video_info(1)
    print(json_data)

if __name__ == "__main__":
    main()
