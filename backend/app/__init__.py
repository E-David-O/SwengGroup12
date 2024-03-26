"Implements the analysis, along with a REST API to upload and analyze a video."

import base64
import json
import logging
import os
from dataclasses import dataclass
from io import BytesIO
from typing import Any, Mapping, TypedDict
from pytube import YouTube
import cv2
from flask import Flask, Response, request
from flask_cors import CORS
from numpy import uint8
from numpy.typing import NDArray
from PIL import Image
from ultralytics import YOLO  # type: ignore
from werkzeug.datastructures import FileStorage

import psycopg2

import psycopg2

from . import auth, frameselector, db
from . import getSetDB
from . import getSetDB


def create_app(test_config = None) -> Flask:
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(auth.bp)
    db.init_app(app)

    @app.route("/upload", methods=["POST"])
    def upload() -> Response:
        "Receives an uploaded video to be analyzed."
        # video_id = getSetDB.set_video(0, "", "", request.form["frameRate"], 0, request.form["resolution"])
        # print(video_id)
        # video_id = getSetDB.set_video(0, "", "", request.form["frameRate"], 0, request.form["resolution"])
        # print(video_id)
        uploaded_video = Video(
            request.files["video"],
            request.form["resolution"],
            request.form["frameRate"],
        )
        # set_video(account_id: int, video_path: str, file_format: str, frame_rate: int, video_length: int, frame_resolution: str)
        video_id = getSetDB.set_video(0, "", "", uploaded_video.frameRate, 0, uploaded_video.resolution)
        print(video_id)

        frames = frameselector.StructuralSimilaritySelector().select_frames(
            uploaded_video.file
        )
        analysis_results = [
            analyze_frame(convert_frame_to_bin(frame.image)) for frame in frames
        ]
        response: list[AnalysisResponse] = [
            {
                "frame_number": frame.frame_number,
                "results": analysed.results,
                "image": analysed.image,
            }
            for analysed, frame in zip(analysis_results, frames)
        ]

        toReturn = {"results": "Test"}

        # json = return_all_video_info(video_id)
        return Response(json.dumps(toReturn), mimetype="application/json")

    @app.route("/uploadLive", methods=["POST"])
    def upload_live() -> Response:
        "Receives a live stream of video data to be analyzed."
        uploaded_file = request.form.getlist("files")
        frames = frameselector.LiveSelector().select_frames(uploaded_file)
        analysis_results = [
            analyze_frame(convert_frame_to_bin(frame.image)) for frame in frames
        ]
        response: list[AnalysisResponse] = [
            {
                "frame_number": frame.frame_number,
                "results": analysed.results,
                "image": analysed.image,
            }
            for analysed, frame in zip(analysis_results, frames)
        ]
        return Response(json.dumps(response), mimetype="application/json")
    
    @app.route("/upload/youtube", methods=["POST"])
    def uploadYoutube():
        "Receives an uploaded video to be analyzed."
        url = request.form["video"]
        yt = YouTube(url)
        stream = yt.streams.filter(file_extension="mp4", res=480).first()
        frames = frameselector.YoutubeSelector().select_frames(
            stream
        )
        analysis_results = [
            analyze_frame(convert_frame_to_bin(frame.image)) for frame in frames
        ]
        response: list[AnalysisResponse] = [
            {
                "frame_number": frame.frame_number,
                "results": analysed.results,
                "image": analysed.image,
            }
            for analysed, frame in zip(analysis_results, frames)
        ]
        toReturn = {
            "results": response,
            "fps" : stream.fps,
        }
        return Response(json.dumps(toReturn), mimetype="application/json")


    return app


@dataclass
class Video:
    "An uploaded video"
    file: FileStorage
    resolution: str
    frameRate: str


class ModelResult(TypedDict):
    class_id: str
    conf: float


class AnalysisResponse(TypedDict):
    frame_number: int | None
    results: list[ModelResult]
    image: str


def convert_frame_to_bin(frame: NDArray[uint8]) -> str:
    "Returns the data of JPEG file in base-64."
    _, imdata = cv2.imencode(".jpg", frame)
    return json.dumps({"image": base64.b64encode(imdata).decode("ascii")})  # type: ignore


@dataclass
class AnalysisResult:
    results: list[ModelResult]
    image: str


def analyze_frame(frame: str) -> AnalysisResult:
    "Uses the YOLOv8 model to detect objects in a base-64 encoded frame."
    try:
        model = analyze_frame.model
    except AttributeError:
        analyze_frame.model = YOLO("yolov8x.pt")
        model = analyze_frame.model
    load = json.loads(frame)
    imdata = base64.b64decode(load["image"])
    im = Image.open(BytesIO(imdata))
    results = model(im, stream=False, device="mps")  # type: ignore
    list_of_results: list[ModelResult] = []
    boxed_image = imdata
    if results:
        pil_img = Image.fromarray(results[0].plot())  # type: ignore
        buff = BytesIO()
        pil_img.save(buff, format="JPEG")
        boxed_image = base64.b64encode(buff.getvalue()).decode("utf-8")
        for result in results:  # type: ignore
            for box in result.boxes:  # type: ignore
                logging.info(result.names[box.cls[0].item()])  # type: ignore
                logging.info(box.conf[0].item())  # type: ignore
                data: ModelResult = {
                    "class_id": result.names[box.cls[0].item()],  # type: ignore
                    "conf": round(box.conf[0].item(), 2),  # type: ignore
                }
                list_of_results.append(data)
    logging.info(list_of_results)
    if isinstance(boxed_image, bytes):
        boxed_image = ""
    return AnalysisResult(list_of_results, boxed_image)
