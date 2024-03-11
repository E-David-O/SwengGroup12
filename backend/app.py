"Implements the frame selection and analysis, along with a REST API to upload and analyze a video."

import base64
import json
import logging
import os
import sys
import tempfile
import time
from io import BytesIO
from typing import NamedTuple

import cv2
import ffmpeg
import numpy as np
from flask import Flask, Response, request
from flask_cors import CORS
from PIL import Image
from skimage.metrics import structural_similarity
from ultralytics import YOLO


model = None
app = None
if __name__ == "__main__":
    app = Flask(__name__)
    logging.basicConfig(level=logging.INFO)
    cors = CORS(
        app,
        resources={
            r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}
        },
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
    results = list(select_frames(uploaded_file.video))
    for entry in results:
        entry["results"] = analyze_frame(convert_frame_to_bin(entry["image"]))
        result = entry["results"]
        entry["results"] = result["results"]
        entry["image"] = result["image"]
    return Response(json.dumps(results), mimetype="application/json")


@app.route("/uploadLive", methods=["POST"])
def upload_live():
    "Receives a live stream of video data to be analyzed."
    uploaded_file = request.form.getlist("files")
    results = select_frames_live(uploaded_file)
    return Response(json.dumps(results), mimetype="application/json")


def vid_resize(vid_path, output_path, width):
    """
    Use ffmpeg to resize the input video to the width given while keeping aspect ratio.
    """
    if not os.path.isdir(os.path.dirname(output_path)):
        raise ValueError(
            f"output_path directory does not exist: {os.path.dirname(output_path)}"
        )
    (
        ffmpeg.input(vid_path)
        .filter("scale", width, -2)
        .filter("format", pix_fmts="yuv420p")
        .output(output_path, format="mp4", crf=18)
        .overwrite_output()
        .run()
    )


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


# Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
FRAME_SKIP = 30
# The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
SIMILARITY_LIMIT = 80
# The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
SIMILARITY_LIMIT_LIVE = 40


def convert_frame_to_bin(frame):
    "Returns the data of JPEG file in base-64."
    _, imdata = cv2.imencode(".jpg", frame)
    return json.dumps({"image": base64.b64encode(imdata).decode("ascii")})


def select_frames(video):
    """
    Selects frames from a video, using structural similarity to optimize frame selection.
    """
    with tempfile.NamedTemporaryFile() as rf:
        with tempfile.NamedTemporaryFile() as tf:
            tf.write(video.read())
            logging.info(tf.name)
            vid_resize(tf.name, rf.name, 480)
            logging.info(rf)

        # Loads the video in to opencvs capture
        vidcap = cv2.VideoCapture(rf.name)
        if not vidcap.isOpened:
            logging.error("Video broken")
            return
        while True:
            success, image = vidcap.read()
            if image is None:
                logging.error("Image broken")
                return
            if success:
                break

        start_time = time.time()
        count = 1
        yield {
            "frame_number": count,
            "image": image,
        }
        analyze_count = 1
        first_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        while success:
            success, image = vidcap.read()
            newframe = image
            logging.info(f"Read frames read: {count}")
            if count > 1 and newframe is not None:
                # Convert current frame to grayscale (needed for structural similarity check)
                new_gray = cv2.cvtColor(newframe, cv2.COLOR_BGR2GRAY)
                # Structural similarity test.
                score = structural_similarity(first_gray, new_gray, full=False)
                logging.info(f"Similarity Score: {score*100:.3f}%")
                if score * 100 < SIMILARITY_LIMIT:
                    yield {
                        "frame_number": count,
                        "image": newframe,
                    }
                    analyze_count += 1
                    first_gray = new_gray
            count += FRAME_SKIP
            # Skip ahead 30 frames from current frame
            vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

    end_time = time.time()
    run_time = end_time - start_time
    logging.info(
        f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
    )
    return


most_recent_frame = None


def select_frames_live(frame_list):
    "select_frames() but for streaming data."
    results_list = []
    global most_recent_frame
    im = base64.b64decode(frame_list[0].split(",")[1])
    image = np.array(Image.open(BytesIO(im)))
    start_time = time.time()
    count = 1
    analyze_count = 0
    new_gray = cv2.cvtColor(cv2.resize(image, (300, 300)), cv2.COLOR_BGR2GRAY)

    # If there is a previous frame, test it to the current frame
    if most_recent_frame is not None:
        first_gray = cv2.cvtColor(
            cv2.resize(most_recent_frame, (300, 300)), cv2.COLOR_BGR2GRAY
        )
        # Structural similarity test.
        score = structural_similarity(first_gray, new_gray, full=False)
        logging.info(f"Similarity Score: {score*100:.3f}%")
        if score * 100 < SIMILARITY_LIMIT:
            data = {
                "results": analyze_frame(convert_frame_to_bin(image)),
            }
            first_gray = new_gray
            results_list.append(data)
            analyze_count = 1
            most_recent_frame = image
    else:
        data = {
            "results": analyze_frame(convert_frame_to_bin(image)),
        }
        results_list.append(data)

        analyze_count = 1
        most_recent_frame = image
        first_gray = new_gray

    # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
    for _ in range(1, len(frame_list)):
        image = np.array(
            Image.open(BytesIO(base64.b64decode(frame_list[count].split(",")[1])))
        )
        newframe = image
        logging.info(f"Read frames read: {count}")
        if count > 1 and newframe is not None:
            # Convert current frame to grayscale (needed for structural similarity check)
            new_gray = cv2.cvtColor(
                cv2.resize(newframe, (300, 300)), cv2.COLOR_BGR2GRAY
            )
            # Structural similarity test.
            score = structural_similarity(first_gray, new_gray, full=False)
            logging.info(f"Similarity Score: {score*100:.3f}%")
            if score * 100 < SIMILARITY_LIMIT:
                data = {
                    "results": analyze_frame(convert_frame_to_bin(newframe)),
                }
                results_list.append(data)
                analyze_count += 1
                first_gray = new_gray
        count += 1

    end_time = time.time()
    run_time = end_time - start_time
    logging.info(
        f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
    )
    for entry in results_list:
        result = entry["results"]
        entry["results"] = result["results"]
        entry["image"] = result["image"]

    return results_list
