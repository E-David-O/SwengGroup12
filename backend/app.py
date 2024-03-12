import os
import sys
from flask import Flask, render_template, request, redirect, url_for, Response
from werkzeug.utils import secure_filename
from flask_cors import CORS
from typing import NamedTuple
from celery import Celery, chain
import cv2
from skimage.metrics import structural_similarity
import os
import sys
import ffmpeg
import numpy as np
import time
import psycopg2
from datetime import timezone
import base64
import tempfile
import json
from io import BytesIO
from PIL import Image
from ultralytics import YOLO
UPLOAD_FOLDER = '/path/to/the/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

def make_celery(app):
    celery = Celery(
        app.import_name,
        broker=f'pyamqp://rabbitmq:5672//',
        backend=f'redis://redis:6379/0'
    )
    
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

celery = make_celery(app)


# def connect_to_database():
#     try:
#         # Change these values according to your PostgreSQL configuration
#         connection = psycopg2.connect(
#             user="postgres",
#             password="postgres",
#             host="172.20.0.10",
#             port="5432",
#             database="DB"
#         )
#         cursor = connection.cursor()
#         print("Connected to db")
#         return connection, cursor
#     except (Exception, psycopg2.Error) as error:
#         print("Error while connecting to PostgreSQL", error)
#         return None, None
    



class Video(NamedTuple):
    video: any
    resolution: str
    frameRate: str

@app.route("/upload", methods=['POST'])
def upload():
    uploaded_file = Video(request.files['video'], request.form['resolution'], request.form['frameRate'])
    print(uploaded_file.video, file=sys.stderr)
    results = select_frames(uploaded_file.video)
    # video = uploaded_file.video.read()
    # byte = base64.b64encode(video)  
    # data = {
    #     'video': byte.decode('utf-8'),
    #     'name': uploaded_file.video.filename,
    # }
    # analyse_video = chain(select_frames.s(data), analyze_task.s())
    # taks_id = analyse_video.apply_async()
    print(results, file=sys.stderr)
    return Response(json.dumps(results),  mimetype='application/json')

@app.route("/uploadLive", methods=['POST'])
def upload_live():
    uploaded_file = request.form.getlist('files')
    results = select_frames_live(uploaded_file)
    print(results, file=sys.stderr)
    return Response(json.dumps(results),  mimetype='application/json')

@app.route("/frames/<uuid:video_id>")
def frames(video_id):
    return { "frames": [] }


@app.route("/results/<uuid:video_id>")
def results(video_id):
    return { "total-score": [], "frame-scores": [] }

model = YOLO('yolov8x.pt')

def vid_resize(vid_path, output_path, width):
    '''
    use ffmpeg to resize the input video to the width given, keeping aspect ratio
    '''
    if not( os.path.isdir(os.path.dirname(output_path))):
        raise ValueError(f'output_path directory does not exists: {os.path.dirname(output_path)}')
    (
        ffmpeg
        .input(vid_path)
        .filter('scale', width, -2)
        .filter('format', pix_fmts='yuv420p')
        .output(output_path, format='mp4', crf=18)
        .overwrite_output()
        .run()
    )

@celery.task(ignore_result=False)
def analyze_task(frame):
    load = json.loads(frame)
    imdata = base64.b64decode(load['image'])
    im = Image.open(BytesIO(imdata))
    results = model(im, stream=False, device='mps')
    list_of_results = []
    boxed_image = imdata
    if results is not None:
        pil_img  = Image.fromarray(results[0].plot())
        buff = BytesIO()
        pil_img.save(buff, format="JPEG")
        boxed_image = base64.b64encode(buff.getvalue()).decode("utf-8")
        for result in results:
            for box in result.boxes:
                print(result.names[box.cls[0].item()], file=sys.stderr)
                print(box.conf[0].item(), file=sys.stderr)
                data = {
                'class_id' :result.names[box.cls[0].item()],
                'conf' : round(box.conf[0].item(), 2),
                }
                list_of_results.append(data)
            # boxes = result.boxes.numpy()  # Boxes object for bounding box outputs
            # xyxys = boxes.xyxy
            # print(xyxys, file=sys.stderr)
    print(list_of_results, file=sys.stderr)
    dict = {
        'results': list_of_results,
        'image': boxed_image
    }
    return dict
FRAME_SKIP = 30                                     #Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
SIMILARITY_LIMIT = 80                               #The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
SIMILARITY_LIMIT_LIVE = 40                             #The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
# def insert_frame_info_to_db(frame_data):
#     try:
#         connection, cursor = connect_to_database()
#         if connection and cursor:
#             # Change "your_table_name" to the actual name of your table
#             postgres_insert_query = """ INSERT INTO Analyzed (id_video, frame_resolution, _timestamp) VALUES (%s,%s,%s)"""
#             # Adjust column names and data accordingly
#             record_to_insert = (frame_data['video_id'], frame_data['resolution'], frame_data['timestamp'])
#             cursor.execute(postgres_insert_query, record_to_insert)
#             connection.commit()
#             cursor.execute("SELECT * FROM Image_Metadata;")
#             print("Data inserted successfully into the table")
#     except (Exception, psycopg2.Error) as error:
#         if connection:
#             print("Failed to insert data into PostgreSQL table", error)
#     finally:
#         if connection:
#             cursor.close()
#             connection.close()

def convert_frame_to_bin(frame):
    _, imdata = cv2.imencode('.jpg',frame)
    jstr = json.dumps({"image": base64.b64encode(imdata).decode('ascii')})
    return jstr

#@celery.task
def select_frames(video):
    results_list = []
   # list_of_frames = []
    # empty temp file
    # byte_data = video['video'].encode('utf-8')
    # b = base64.b64decode(byte_data)

    tf = tempfile.NamedTemporaryFile()
    rf = tempfile.NamedTemporaryFile()
    tf.write(video.read())
    print(tf.name, file=sys.stderr)
    vid_resize(tf.name, rf.name, 480)
    print(rf, file=sys.stderr)
    tf.close()
    # video contents
    # with open(f'/{video.name}', 'wb') as tf:
    #     tf.write(b)
    
    analyze_count = 0
    vidcap = cv2.VideoCapture(rf.name)       #Loads the video in to opencvs capture
    if not vidcap.isOpened:
        print('Video broken', file=sys.stderr)
    while True:
        success,image = vidcap.read()
        if image is None:
            print('Image broken', file=sys.stderr)

        if success == True:
            break

       
    start_time = time.time()
    count = 1
    data = {
        'frame_number': count,
        'results' : analyze_task.delay(convert_frame_to_bin(image)),
    }
    results_list.append(data)
    #list_of_frames.append(convert_frame_to_bin(image))
    #cv2.imwrite(os.path.join(path , 'analyze_frame%d.jpg' % analyze_count), image) #The very first frame is saved since it will be our first frame to be analyzed
    analyze_count += 1
    first_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    while success:                                                                 #If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        success,image = vidcap.read()
        newframe = image
        print('Read frames read: ', count)
        if count > 1 and newframe is not None:
            new_gray = cv2.cvtColor(newframe, cv2.COLOR_BGR2GRAY)                  #Convert current frame to grayscale (needed for structural similarity check)
            score = structural_similarity(first_gray, new_gray, full=False)        #Structural similarity test.
            print("Similarity Score: {:.3f}%".format(score * 100), file=sys.stderr)
            if score * 100 < SIMILARITY_LIMIT:
                data = {
                    'frame_number': count,
                    'results' : analyze_task.delay(convert_frame_to_bin(newframe)),
                }
                results_list.append(data)
                #list_of_frames.append(convert_frame_to_bin(newframe))
                #cv2.imwrite(os.path.join(path , 'analyze_frame%d.jpg' % analyze_count), newframe)   #If its below the treshhold send new frame to analysis
                analyze_count += 1
                first_gray = new_gray
        count += FRAME_SKIP                                                        
        vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)                                  #Skip ahead 30 frames from current frame

    rf.close()
    end_time = time.time()
    run_time = end_time - start_time
    print("Out of the %(frames)d images %(analyzed)d where sent for further analysis. \nTotal time: %(time)ds" % {"frames": count, "analyzed" :analyze_count, "time": run_time})
    for entry in results_list:
        result = entry['results'].get()
        entry['results'] = result['results']
        entry['image'] = result['image']
    
    return results_list


most_recent_frame = None

def select_frames_live(frame_list):
    results_list = []
    global most_recent_frame
   # list_of_frames = []
    # empty temp file
    # byte_data = video['video'].encode('utf-8')
    # b = base64.b64decode(byte_data)
    im = base64.b64decode(frame_list[0].split(",")[1])
    image = np.array(Image.open(BytesIO(im)))
    start_time = time.time()
    count = 1
    analyze_count = 0
    new_gray = cv2.cvtColor(cv2.resize(image,(300,300)), cv2.COLOR_BGR2GRAY) 
    if(most_recent_frame is not None):                                          #If there is a previous frame, test it to the current frame
        first_gray = cv2.cvtColor(cv2.resize(most_recent_frame, (300,300) ), cv2.COLOR_BGR2GRAY)
        score = structural_similarity(first_gray, new_gray, full=False)        #Structural similarity test.
        print("Similarity Score: {:.3f}%".format(score * 100), file=sys.stderr)
        if score * 100 < SIMILARITY_LIMIT:
            data = {
                'results' : analyze_task.delay(convert_frame_to_bin(image)),
            }
            first_gray = new_gray
            results_list.append(data)
            analyze_count = 1
            most_recent_frame = image
    else:        
        data = {
            'results' : analyze_task.delay(convert_frame_to_bin(image)),
        }
        results_list.append(data)
        
        analyze_count = 1
        most_recent_frame = image
        first_gray = new_gray                                                            #If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
    
    for i in range (1, len(frame_list)):                                                               #If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        image = np.array(Image.open(BytesIO(base64.b64decode(frame_list[count].split(",")[1]))))
        newframe = image
        print('Read frames read: ', count)
        if count > 1 and newframe is not None:
            new_gray = cv2.cvtColor(cv2.resize(newframe, (300,300)), cv2.COLOR_BGR2GRAY)                  #Convert current frame to grayscale (needed for structural similarity check)
            score = structural_similarity(first_gray, new_gray, full=False)        #Structural similarity test.
            print("Similarity Score: {:.3f}%".format(score * 100), file=sys.stderr)
            if score * 100 < SIMILARITY_LIMIT:
                data = {
                    'results' : analyze_task.delay(convert_frame_to_bin(newframe)),
                }
                results_list.append(data)
                analyze_count += 1
                first_gray = new_gray
        count += 1                                                        
        
    end_time = time.time()
    run_time = end_time - start_time
    print("Out of the %(frames)d images %(analyzed)d where sent for further analysis. \nTotal time: %(time)ds" % {"frames": count, "analyzed" :analyze_count, "time": run_time})
    for entry in results_list:
        result = entry['results'].get()
        entry['results'] = result['results']
        entry['image'] = result['image']
    
    return results_list
