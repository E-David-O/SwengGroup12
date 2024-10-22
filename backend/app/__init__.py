"Implements the analysis, along with a REST API to upload and analyze a video."

import base64
import json
import logging
import os
import sys
from http import HTTPStatus
import numpy as np
import time
from dataclasses import dataclass
from io import BytesIO
from typing import Any, Mapping, TypedDict, List
from pytube import YouTube
from vimeo_downloader import Vimeo
import cv2
from flask import Flask, Response, request
from flask_cors import CORS
from numpy import uint8
from numpy.typing import NDArray
from PIL import Image
from ultralytics import YOLO  # type: ignore
from werkzeug.datastructures import FileStorage

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

    # logging.basicConfig(filename='app.log', level=logging.INFO)

    # logging.basicConfig(filename='app.log', level=logging.INFO)

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

    small_model = YOLO("yolov8n.pt")

    @app.route("/account_videos", methods=["GET"])
    def get_account_videos() -> Response:
        user = getSetDB.get_user(request.args.get('username'))
        if user is None:
            return Response(
            json.dumps({"message": "User not found"}),
            HTTPStatus.UNAUTHORIZED,
            mimetype="application/json",
             )
        user = json.loads(user)
        print(user, file=sys.stderr)
        return Response(getSetDB.get_account_videos(user["id"]), mimetype="application/json")

    @app.route("/upload", methods=["POST"])
    def upload() -> Response:
        "Receives an uploaded video to be analyzed."
        frameDict = []
        fps = 59.97
        user = getSetDB.get_user(request.form["username"])
        if user is None:
            return Response(
            json.dumps({"message": "User not found"}),
            HTTPStatus.UNAUTHORIZED,
            mimetype="application/json",
             )
        user = json.loads(user)
        print(user, file=sys.stderr)
        if request.files is None or "video" not in request.files:
            uploaded_video = VideoURL(
                request.form["video"],
                request.form["resolution"],
                request.form["frameRate"],
                request.form["model"],
                request.form["frameselector"],
                request.form["videoname"],
            )
            selectors = uploaded_video.frameselector.split(", ")
            fileType = uploaded_video.name.split(".")[-1]
            if 'youtube' in uploaded_video.file:
                yt = YouTube(uploaded_video.file)
                stream = yt.streams.filter(file_extension="mp4", res=480).first()
                fps = stream.fps
                video_id = getSetDB.set_video(user["id"], uploaded_video.file, fileType, fps, 0, "480", 1, uploaded_video.name)
                frameDict = frameselector.YoutubeSelector().select_frames(stream, selectors, video_id)
            elif 'vimeo' in uploaded_video.file:
                v = Vimeo(uploaded_video.file)
                stream = v.streams[0]
                fps = frameselector.VimeoSelector().get_fps(stream)
                meta = v.metadata
                logging.info(meta._fields)

                video_id = getSetDB.set_video(user["id"], uploaded_video.file, fileType, fps, 0, "480", 1, uploaded_video.name)
                frameDict = frameselector.VimeoSelector().select_frames(stream, selectors, video_id)
            elif 'tiktok' in uploaded_video.file:
                video_id = getSetDB.set_video(user["id"], uploaded_video.file, fileType, fps, 0, "480", 1, uploaded_video.name)
                frameDict = frameselector.TiktokSelector().select_frames(
                uploaded_video.file, selectors, video_id)
        else:
            uploaded_video = VideoFile(
                request.files["video"],
                request.form["resolution"],
                request.form["frameRate"],
                request.form["model"],
                request.form["frameselector"],
                request.form["videoname"],
            )
            selectors = uploaded_video.frameselector.split(", ")
            file = uploaded_video.file
            file_str = base64.b64encode(file.read()).decode('utf-8')
            fileType = uploaded_video.name.split(".")[-1]
            uploaded_video.file.seek(0)
            logging.info("Frame Rate: " + str(fps))
            video_id = getSetDB.set_video(user["id"], file_str, fileType, fps, 0, "480", 0, uploaded_video.name)
            logging.info("The video id is " + str(video_id))
            frameDict = frameselector.StructuralSimilaritySelector().select_frames(
                uploaded_video.file, selectors, video_id
            )
      
            
        selector_result = []
        for frameSelector in frameDict:
            frames = frameSelector["frames"]
            analysis_results = []
            start = time.time()
            for frame in frames:
                if selector_result == []:
                    analysed = analyze_frame(convert_frame_to_bin(frame.image), frame.frame_id, small_model, 1)
                else:
                    my_item = next((item for item in selector_result[0]['frames'] if item['frame_number'] == frame.frame_number), None)
                    if my_item is None:
                        analysed = analyze_frame(convert_frame_to_bin(frame.image), frame.frame_id, small_model, 1)
                    else:
                        print("using previous result", file=sys.stderr)
                        analysed = AnalysisResult(my_item['results'], my_item['image'])
                        getSetDB.set_selected_frame_img(frame.frame_id, analysed.image)
                        for result in analysed.results:
                            getSetDB.set_frame_objects(frame.frame_id, result['class_id'], result['conf'], 1)

                analysis_results.append(analysed)
            end = time.time()
            runtime = end - start
            if end - start < 0.001:
                end = start + selector_result[0]['analysis_time']/(len(selector_result[0]['frames'])/len(frames))
            if frameSelector["selector"] == 'Structural Similarity':
                getSetDB.set_video_structural_analysis_runtime(video_id, runtime)
            elif frameSelector["selector"]  == 'Structural Similarity + Homogeny':
                getSetDB.set_video_homogeny_analysis_runtime(video_id, runtime)
            elif frameSelector["selector"]  == 'Frame by Frame':
                getSetDB.set_video_frame_analysis_runtime(video_id, runtime)
                

            # models = uploaded_video.model.split(", ")
            # for model in models:
            #     if model == 'Small':
            #         small_model_analysis = [
            #             analyze_frame(convert_frame_to_bin(frame.image), frame.frame_id, small_model, 0) for frame in frames
            #         ]
            #         analysis_results(small_model_analysis)
            #     if model == 'Large':
            #         large_model_analysis = [
            #             analyze_frame(convert_frame_to_bin(frame.image), frame.frame_id, large_model, 1) for frame in frames
            #         ]
            #         analysis_results.append(large_model_analysis)
            response: list[AnalysisResponse] = [
                {
                    "frame_number": frame.frame_number,
                    "results": analysed.results,
                    "image": analysed.image,
                }
                for analysed, frame in zip(analysis_results, frames)
            ]
            # something is not working with the frame selectors to return the run_time
            # but should be stored in the database
            selector_result.append(SelectorAnalysisResponse({
                "selector": frameSelector["selector"],
                "frames": response,
                "run_time" : frameSelector["run_time"],
                "analysis_time" : end - start

            }))
        toReturn = {
            "results": selector_result,
            "fps" : fps,
        }
        # logging.info(str(json.loads(getSetDB.return_all_video_info(video_id))))
        return Response(json.dumps(toReturn), mimetype="application/json")

    @app.route("/uploadLive", methods=["POST"])
    def upload_live() -> Response:
        "Receives a live stream of video data to be analyzed."
        uploaded_file = request.form.getlist("files")
        selectors = request.form["frameselector"]
        selectors = selectors.split(", ")
        frameDict = []
        for selector in selectors:
            if selector == 'Structural Similarity':
                start = time.time()
                frames = frameselector.LiveSelector().select_frames(uploaded_file)
                end = time.time()
                frameDict.append(FrameResponse({
                    "selector": selector,
                    "frames": frames,
                    "run_time": end - start
                })    
                )
            elif selector == 'Structural Similarity + Homogeny':
                start = time.time()
                frames = frameselector.LiveSelector().select_frames_homogeny(uploaded_file)
                end = time.time()
                frameDict.append(FrameResponse({
                    "selector": selector,
                    "frames": frames,
                    "run_time": end - start
                })    
                )
            elif selector == 'Frame by Frame':
                start = time.time()
                frames = frameselector.LiveSelector().select_frames_traditional(uploaded_file)
                end = time.time()
                frameDict.append(FrameResponse({
                    "selector": selector,
                    "frames": frames,
                    "run_time": end - start
                })    
                )

        selector_result = []
        for frame in frameDict:
            frames = frame["frames"]
            start = time.time()
            analysis_results = [
                analyze_frame_live(convert_frame_to_bin(frame)) for frame in frames
            ]
            end = time.time()
            response: list[AnalysisResponseLive] = [
                {
                    "results": analysed.results,
                    "image": analysed.image,
                }
                for analysed in analysis_results
            ]
            selector_result.append(SelectorAnalysisResponse({
                "selector": frame["selector"],
                "frames": response,
                "run_time" : frame["run_time"],
                "analysis_time" : end - start
            }))
        return Response(json.dumps(selector_result), mimetype="application/json")
    
    

    return app


@dataclass
class VideoFile:
    "An uploaded video"
    file: FileStorage
    resolution: str
    frameRate: str
    model: str
    frameselector: str
    name: str


@dataclass
class VideoURL:
    "An uploaded video"
    file: str
    resolution: str
    frameRate: str
    model: str
    frameselector: str
    name: str


class ModelResult(TypedDict):
    class_id: str
    conf: float

@dataclass
class AnalysisResult:
    results: list[ModelResult]
    image: str

class AnalysisResponse(TypedDict):
    frame_number: int | None
    results: list[ModelResult]
    image: str

class AnalysisResponseLive(TypedDict):
    results: list[ModelResult]
    image: str
@dataclass
class SelectedFrame:
    "The metadata of a selected frame."
    frame_number: int | None
    image: NDArray[np.uint8]

class FrameResponse(TypedDict):
    selector : str
    frames : list[SelectedFrame]
    run_time : float

class SelectorAnalysisResponse(TypedDict):
    selector: str
    frames: list[AnalysisResponse]
    run_time: float
    analysis_time: float

def convert_frame_to_bin(frame: NDArray[uint8]) -> str:
    "Returns the data of JPEG file in base-64."
    _, imdata = cv2.imencode(".jpg", frame)
    return json.dumps({"image": base64.b64encode(imdata).decode("ascii")})  # type: ignore





# def analyze_frame(frame: str, frame_id: int, model, model_selection: int) -> AnalysisResult:
#     "Uses the YOLOv8 model to detect objects in a base-64 encoded frame."
#     try:
#         model = analyze_frame.model
#     except AttributeError:
#         analyze_frame.model = YOLO("yolov8n.pt")
#         model = analyze_frame.model
#     load = json.loads(frame)
#     imdata = base64.b64decode(load["image"])
#     im = Image.open(BytesIO(imdata))
#     results = model(im, stream=False, device="mps")  # type: ignore
#     list_of_results: list[ModelResult] = []
#     boxed_image = imdata
#     if results:
#         pil_img = Image.fromarray(results[0].plot())  # type: ignore
#         buff = BytesIO()
#         pil_img.save(buff, format="JPEG")
#         boxed_image = base64.b64encode(buff.getvalue()).decode("utf-8")
#         # logging.info(boxed_image)
#         getSetDB.set_selected_frame_img(frame_id, boxed_image)
#         for result in results:  # type: ignore
#             for box in result.boxes:  # type: ignore
#                 getSetDB.set_frame_objects(frame_id, result.names[box.cls[0].item()], box.conf[0].item(), model_selection)
#                 logging.info(result.names[box.cls[0].item()])  # type: ignore
#                 logging.info(box.conf[0].item())  # type: ignore
#                 data: ModelResult = {
#                     "class_id": result.names[box.cls[0].item()],  # type: ignore
#                     "conf": round(box.conf[0].item(), 2),  # type: ignore
#                 }
#                 list_of_results.append(data)
#     logging.info(list_of_results)
#     if isinstance(boxed_image, bytes):
#         boxed_image = ""
#     return AnalysisResult(list_of_results, boxed_image)


def analyze_frame(frame: str, frame_id: int, model, model_selection) -> AnalysisResult:
    "Uses the YOLOv8 model to detect objects in a base-64 encoded frame."
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
        getSetDB.set_selected_frame_img(frame_id, boxed_image)
        for result in results:  # type: ignore
            for box in result.boxes:  # type: ignore
                logging.info(result.names[box.cls[0].item()])  # type: ignore
                logging.info(box.conf[0].item())  # type: ignore
                getSetDB.set_frame_objects(frame_id, result.names[box.cls[0].item()], box.conf[0].item(), model_selection)
                data: ModelResult = {
                    "class_id": result.names[box.cls[0].item()],  # type: ignore
                    "conf": round(box.conf[0].item(), 2),  # type: ignore
                }
                list_of_results.append(data)
    logging.info(list_of_results)
    if isinstance(boxed_image, bytes):
        boxed_image = ""
    return AnalysisResult(list_of_results, boxed_image)

def analyze_frame_live(frame: str) -> AnalysisResult:
    "Uses the YOLOv8 model to detect objects in a base-64 encoded frame."
    try:
        model = analyze_frame.model
    except AttributeError:
        analyze_frame.model = YOLO("yolov8n.pt")
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