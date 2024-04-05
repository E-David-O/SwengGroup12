
#Change to folder that you are storing getSetDB
from . import getSetDB
import json

def test_connect_to_database():
    connection, cursor = getSetDB.connect_to_database()
    print("Connection:", connection)
    print("Cursor:", cursor)
    assert connection is not None 
    assert cursor is not None
    print("test_connect_to_database has passed")
    if connection:
            connection.commit()
            cursor.close()
            connection.close()
    

def test_connect_to_minio():
    minioclient = getSetDB.connect_to_minio()
    assert minioclient is not None
    print("test_connect_to_minio has passed")

def test_setGet_user():
    #The values that we are going to input for testing
    username = "testUserName"
    password = "testPassword"
    json = "testJson"

    #Calling set user and get user to make sure the data was
    #Uploaded and retreived successfully
    getSetDB.set_user(username, password, json)
    #is_username is true
    json_data = getSetDB.get_user(username, 0, True)
    
    assert json_data is not None
    assert len(json_data)==1
    parsed_data=json.loads(json_data)
    user_data = parsed_data[0]
    #Make sure the correct data was returned
    assert user_data["username"] == username
    assert user_data["password"] == password
    assert user_data["json"] == json

    id = user_data["id"]

    #is_username is false
    json_data = getSetDB.get_user(username, id, False)
    
    assert json_data is not None
    assert len(json_data)==1
    parsed_data=json.loads(json_data)
    user_data = parsed_data[0]
    #Make sure the correct data was returned
    assert user_data["username"] == username
    assert user_data["password"] == password
    assert user_data["json"] == json
    assert user_data["id"] == id


    #Delete test row from database
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            input_query = """DELETE * FROM Users WHERE username = %s;"""
            cursor.execute(input_query, (username))

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to delete data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None

    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def test_setGet_selected_frame():
    #The values that we are going to input for testing
    id1 = 99988
    id2 = 99876
    video_id = 99989
    frameNumber1 = 777888
    frameNumber2 = 777889

    #Calling set frames and get frames to make sure the data was
    #Uploaded and retreived successfully
    getSetDB.set_selected_frame(id1, video_id, frameNumber1)
    getSetDB.set_selected_frame(id2, video_id, frameNumber2)
    json_data = getSetDB.get_user(video_id)

    assert json_data is not None
    assert len(json_data)==2
    parsed_data=json.loads(json_data)

    user_data = parsed_data[0]
    #Make sure the correct data was returned for first frame
    assert user_data["idFrame"] == id1
    assert user_data["idVideo"] == video_id
    assert user_data["frameNumber"] == frameNumber1

    user_data = parsed_data[1]
    #Make sure the correct data was returned for first frame
    assert user_data["idFrame"] == id2
    assert user_data["idVideo"] == video_id
    assert user_data["frameNumber"] == frameNumber2


    #Delete test row from database
    try:
        connection, cursor = getSetDB.connect_to_database()
        if connection and cursor:
            input_query = """DELETE * FROM SelectedFrame WHERE idVideo = %d;"""
            cursor.execute(input_query, (video_id))

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to delete data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None

    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def test_setGet_analyzed_frames():

    #The values that we are going to input for testing
    idFrame = 1234321
    objectDetected = "testObject"
    confidence = 0.884
    framePath = "testPath"

    #Calling set analyzed frames and get analyzed frames to make sure the data was
    #Uploaded and retreived successfully
    getSetDB.set_analyzed_frames(idFrame, objectDetected, confidence, framePath)
    json_data = getSetDB.get_analyzed_objects(idFrame)

    assert json_data is not None
    assert len(json_data)==1
    parsed_data=json.loads(json_data)

    user_data = parsed_data[0]

    #Make sure the correct data was returned
    assert user_data["idFrame"] == idFrame
    assert user_data["objectDetected"] == objectDetected
    assert user_data["confidence"] == confidence
    assert user_data["framePath"] == framePath





    #Delete test row from database
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            input_query = """DELETE * FROM AnalyzedFrames WHERE framePath = %s;"""
            cursor.execute(input_query, (framePath))

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to delete data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None

    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()

def test_setGet_video():
    #The values that we are going to input for testing
    account_id = 1234321
    video_path = "testPath"
    file_format = "mp4"
    frame_rate = 333
    video_length = 50
    frame_resolution = "testFrameRes"

    #Calling set analyzed frames and get analyzed frames to make sure the data was
    #Uploaded and retreived successfully
    getSetDB.set_video(account_id, video_path, file_format,
                        frame_rate, video_length, frame_resolution)

    #have to obtain serial video id
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:

            input_query = """SELECT * FROM Videos WHERE id = %d;"""
            cursor.execute(input_query, (video_id,))
            rows = cursor.fetchall()
            rows_as_dicts = []
            for row in rows:
                row_dict = dict(zip([col.name for col in cursor.description], row))
                for key, value in row_dict.items():
                    if isinstance(value, datetime):
                        row_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')
                rows_as_dicts.append(row_dict)
            json_data = json.dumps(rows_as_dicts)

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

    parsed_data = json.loads(json_data)
    user_data = parsed_data[0]
    #Make sure the correct data was returned
    idVideo = user_data["id"]

    json_data = getSetDB.get_video(idVideo)

    assert json_data is not None
    assert len(json_data)==1
    parsed_data=json.loads(json_data)

    user_data = parsed_data[0]

    #Make sure the correct data was returned
    assert user_data["account_id"] == account_id
    assert user_data["video_path"] == video_path
    assert user_data["file_format"] == file_format
    assert user_data["frame_rate"] == frame_rate
    assert user_data["video_length"] == video_length
    



    #Delete test row from database
    try:
        connection, cursor = connect_to_database()
        if connection and cursor:
            input_query = """DELETE * FROM Videos WHERE video_path = %s;"""
            cursor.execute(input_query, (video_path))

    except (Exception, psycopg2.Error) as error:
        if connection:
            print("Could connect, but failed to delete data: ", error)
            return None
        else:
            print("Failed to connect: ", error)
            return None

    finally:
        if connection:
            connection.commit()
            cursor.close()
            connection.close()


def main():
    test_connect_to_database()

if __name__ == "__main__":
    main()




