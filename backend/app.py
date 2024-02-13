import os
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
from flask_cors import CORS
from typing import NamedTuple

UPLOAD_FOLDER = '/path/to/the/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

class Video(NamedTuple):
    video: any
    resolution: str
    frameRate: str

@app.route("/upload", methods=['POST'])
def upload():
    uploaded_file = Video(request.files['video'], request.form['resolution'], request.form['frameRate'])
    if uploaded_file.video.filename != '':
       uploaded_file.video.save(uploaded_file.video.filename)
    return { "video-id": "ef1d3c7b-257c-4d5e-9f61-38750a1e06d1" }


@app.route("/frames/<uuid:video_id>")
def frames(video_id):
    return { "frames": [] }


@app.route("/results/<uuid:video_id>")
def results(video_id):
    return { "total-score": [], "frame-scores": [] }

