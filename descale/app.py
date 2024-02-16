import os
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import ffmpeg
from event_handler import emit_video_update
from typing import NamedTuple
app = Flask(__name__)

class Video(NamedTuple):
    video: any
    resolution: str
    frameRate: str


@app.route("/", methods=['POST'])
def upload():
    uploaded_file = Video(request.files['video'], request.form['resolution'], request.form['frameRate'])
    process = (
        ffmpeg
        .input(uploaded_file.video, f=uploaded_file.video.content_type)
        .output(
            'output.mp4', # output format
            vcodec = "libx264", # video codec
            scale = "1:" + uploaded_file.resolution, # resolution
            framerate = uploaded_file.frameRate, # frame rate
            codec = "copy", # use same codecs of the original video
            listen=1) # enables HTTP server
        .global_args("-re") # argument to act as a live stream
        .run()
    )
    emit_video_update(process)
    return { "video-id": "ef1d3c7b-257c-4d5e-9f61-38750a1e06d1" }

