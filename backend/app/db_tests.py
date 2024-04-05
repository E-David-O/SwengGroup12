
import json

import getSetDB

def test_connect_to_db():
    connection, cursor = getSetDB.connect_to_database()
    assert connection is not None
    assert cursor is not None
    print("test_connect_to_db has passed")
    if connection:
        cursor.close()
        connection.close()

def test_connect_to_minio():
    minio = getSetDB.connect_to_minio()

    assert minio is not None
    print("test_connect_to_minio has passed")

def test_set_get_user():
    username = "testUsername"
    password = "testPassword"

    getSetDB.set_user(username, password)

    json_data = getSetDB.get_user(username)

    user = json.loads(json_data)

    assert user is not None
    print(user["username"])
    assert user["username"] == username
    assert user["password"] == password

    print("test_set_get_user has passed")

def test_set_get_video():
    account_id = 0
    encoded_video = "Encoded Video"
    file_format = "mp4"
    frame_rate = "60"
    video_length = 10
    frame_resolution = "480"
    is_link = 0
    video_name = "Video"
    video_id = getSetDB.set_video(account_id, encoded_video, file_format, frame_rate, video_length, frame_resolution, is_link, video_name)

    json_data = getSetDB.get_video(video_id)

    video_data = json.loads(json_data)
    
    assert video_data["id"] == video_id
    assert video_data["idAccount"] == account_id
    assert video_data["encoded_video"] == encoded_video
    assert video_data["fileFormat"] == file_format
    # print(type(video_data["frameRate"]))
    # print(type(video_data["videoLength"]))
    assert video_data["frameRate"] == int(frame_rate)
    assert video_data["videoLength"] == str(video_length)
    assert video_data["is_link"] == is_link
    assert video_data["video_name"] == video_name

    print("test_set_get_video has passed")

def test_set_get_frame():
    frame_id = 1
    video_id = 1
    frameNumber = 30
    selection_method = 1
    frameData = "Hello World"

    id = getSetDB.set_selected_frame(frame_id, video_id, frameNumber, selection_method, frameData)
    
    json_data = getSetDB.get_selected_frames(video_id)

    frame_data = json.loads(json_data)[0]
    
    assert frame_data["idFrame"] == frame_id
    assert frame_data["idVideo"] == video_id
    assert frame_data["frameNumber"] == frameNumber
    assert frame_data["selectionMethod"] == selection_method
    assert frame_data["frameData"] == frameData

    print("test_set_get_frame has passed")


def test_set_get_object():
    idFrame = 1
    objectDetected = "Cat"
    confidence = 0.99
    modelMethod = 1

    getSetDB.set_frame_objects(idFrame, objectDetected, confidence, modelMethod)

    json_data = getSetDB.get_frame_objects(idFrame)

    objects = json.loads(json_data)

    object = objects[0]

    assert object["idFrame"] == str(idFrame)
    assert object["objectDetected"] == objectDetected
    assert object["confidence"] == confidence
    assert object["modelMethod"] == modelMethod

def delete_all_test():
    getSetDB.delete_all_test_data()
    print("removed all test data")


def main():
    test_connect_to_db()
    test_connect_to_minio()
    test_set_get_video()
    test_set_get_frame()
    test_set_get_object()
    delete_all_test()
    
if __name__ == "__main__":
    main()
