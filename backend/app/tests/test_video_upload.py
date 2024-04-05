import os
import pytest
from werkzeug.datastructures import FileStorage
from app import create_app

@pytest.fixture
def app():
    app = create_app({"TESTING": True})
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_video():
    # Path to the test video file
    video_path = os.path.join(os.path.dirname(__file__), 'test_data', 'TCD_short.mp4')
    return FileStorage(
        stream=open(video_path, 'rb'),
        filename="test_video.mp4",
        content_type="video/mp4",
    )

def test_upload_endpoint(client, test_video):
    data = {
        'video': test_video,
        'resolution': '720p',
        'frameRate': '30',
        'model': 'small',
        'frameselector': 'StructuralSimilarity',
        'username': 'testuser',
        'videoName': 'test_video.mp4',  
    }
    response = client.post('/upload', content_type='multipart/form-data', data=data)
    assert response.status_code == 401
    # Further assertions can be added here based on what the endpoint returns

    # Clean up if necessary, e.g., closing the file stream
    test_video.stream.close()