"Implements the frame selection and analysis, along with a REST API to upload and analyze a video."

import base64
import json
import logging
import os
import tempfile
import time
from io import BytesIO
from typing import NamedTuple
from pytube import YouTube
import cv2
import frameselector
from flask import Flask, Response, request
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO


app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
cors = CORS(
    app,
    resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}},
)
model = YOLO("yolov8n.pt")


class Video(NamedTuple):
    "An uploaded video"
    video: any
    resolution: str
    frameRate: str


@app.route("/upload", methods=["POST"])
def upload():
    "Receives an uploaded video to be analyzed."
    uploaded_file = Video(
        request.files["video"], request.form["resolution"], request.form["frameRate"]
    )
    results = frameselector.StructuralSimilaritySelector().select_frames(
        uploaded_file.video
    )
    for entry in results:
        entry["results"] = analyze_frame(convert_frame_to_bin(entry["image"]))
        result = entry["results"]
        entry["results"] = result["results"]
        entry["image"] = result["image"]
    toReturn = {
        "results": results,
    }
    return Response(json.dumps(toReturn), mimetype="application/json")

@app.route("/upload/youtube", methods=["POST"])
def uploadYoutube():
    "Receives an uploaded video to be analyzed."
    url = request.form["video"]
    yt = YouTube(url)
    stream = yt.streams.filter(file_extension="mp4", res=480).first()
    results = frameselector.YoutubeSelector().select_frames(
        stream
    )
    for entry in results:
        entry["results"] = analyze_frame(convert_frame_to_bin(entry["image"]))
        result = entry["results"]
        entry["results"] = result["results"]
        entry["image"] = result["image"]
    toReturn = {
        "results": results,
        "fps" : stream.fps,
    }
    return Response(json.dumps(toReturn), mimetype="application/json")


@app.route("/uploadLive", methods=["POST"])
def upload_live():
    "Receives a live stream of video data to be analyzed."
    uploaded_file = request.form.getlist("files")
    results = frameselector.LiveSelector().select_frames(uploaded_file)
    for entry in results:
        entry["results"] = analyze_frame(convert_frame_to_bin(entry["image"]))
        result = entry["results"]
        entry["results"] = result["results"]
        entry["image"] = result["image"]
    return Response(json.dumps(results), mimetype="application/json")


def convert_frame_to_bin(frame):
    "Returns the data of JPEG file in base-64."
    _, imdata = cv2.imencode(".jpg", frame)
    return json.dumps({"image": base64.b64encode(imdata).decode("ascii")})


def analyze_frame(frame):
    "Uses the YOLOv8 model to detect objects in a base-64 encoded frame."

    load = json.loads(frame)
    imdata = base64.b64decode(load["image"])
    im = Image.open(BytesIO(imdata))
    results = model(im, stream=False, device="mps")
    list_of_results = []
    boxed_image = imdata
    if results is not None:
        pil_img = Image.fromarray(results[0].plot())
        buff = BytesIO()
        pil_img.save(buff, format="JPEG")
        boxed_image = base64.b64encode(buff.getvalue()).decode("utf-8")
        for result in results:
            for box in result.boxes:
                logging.info(result.names[box.cls[0].item()])
                logging.info(box.conf[0].item())
                data = {
                    "class_id": result.names[box.cls[0].item()],
                    "conf": round(box.conf[0].item(), 2),
                }
                list_of_results.append(data)
    logging.info(list_of_results)
    return {"results": list_of_results, "image": boxed_image}
