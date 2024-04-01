"Classes to select frames from a video."

import base64
import logging
import os
import tempfile
import time
import sys
import concurrent.futures
from abc import ABC, abstractmethod
from dataclasses import dataclass
from yt_dlp import YoutubeDL
from io import BytesIO
from typing import Iterator, List, TypedDict
import cv2
import ffmpeg  # type: ignore
import numpy as np
from numpy.typing import NDArray
from PIL import Image
from skimage.metrics import structural_similarity  # type: ignore
from werkzeug.datastructures import FileStorage
from . import getSetDB


def vid_resize(vid_path: str, output_path: str, width: int):
    """
    Use ffmpeg to resize the input video to the width given while keeping aspect ratio.
    """
    if not os.path.isdir(os.path.dirname(output_path)):
        raise ValueError(
            f"output_path directory does not exist: {os.path.dirname(output_path)}"
        )
    (
        ffmpeg.input(vid_path)  # type: ignore
        .filter("scale", width, -2)
        .filter("format", pix_fmts="yuv420p")
        .output(output_path, format="mp4", crf=18)
        .overwrite_output()
        .run()
    )


 # Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
FRAME_SKIP = 30
# The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
SIMILARITY_LIMIT = 80

def ssim_selector(vid, video_id):
    vidcap = cv2.VideoCapture(vid)
    if not vidcap.isOpened():
        logging.error("Video broken")
        return
    while True:
        success, image = vidcap.read()
        if success:
            break

    start_time = time.time()
    count = 1
    analyze_count = 1
    frame_id = getSetDB.set_selected_frame(analyze_count, video_id, count, 0, base64.b64encode(image).decode('utf-8'))
    yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB), frame_id)  # type: ignore
    count += 1
    first_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
    while success:
        success, image = vidcap.read()
        newframe = image
        logging.info(f"Read frames read: {count}")
        if count > 1 and success:
            # Convert current frame to grayscale (needed for structural similarity check)
            new_gray = cv2.cvtColor(newframe, cv2.COLOR_BGR2GRAY)
            # Structural similarity test.
            score: np.float64 = structural_similarity(first_gray, new_gray, full=False)  # type: ignore
            logging.info(f"Similarity Score: {score*100:.3f}%")
            if score * 100 < SIMILARITY_LIMIT:
                analyze_count += 1
                frame_id = getSetDB.set_selected_frame(analyze_count, video_id, count, 0, base64.b64encode(image).decode('utf-8'))
                yield SelectedFrame(count, cv2.cvtColor(newframe, cv2.COLOR_BGR2RGB), frame_id)   # type: ignore
                first_gray = new_gray
        count += FRAME_SKIP
        # Skip ahead 30 frames from current frame
        vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

    end_time = time.time()
    run_time = end_time - start_time
    logging.info(
        f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
    )
    getSetDB.set_video_structural_runtime(video_id, run_time)
    return

# Flann index
FLANN_INDEX_KDTREE = 1
# Minimum number of good feature point matches to comnclude identical object in the two image
MIN_MATCH_COUNT = 40
#If we find more good identical feature points than this we set this frame as the new reference to help filter selection.
OVERWRIGHT_LIMIT = 100

def ssim_homogeny_selector(vid, video_id):
       
        sift = cv2.SIFT_create()
    
        # Loads the video in to opencvs capture
        vidcap = cv2.VideoCapture(vid)
        if not vidcap.isOpened():
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
        analyze_count = 1
        frame_id = getSetDB.set_selected_frame(analyze_count, video_id, count, 1, base64.b64encode(image).decode('utf-8'))
        yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB), frame_id)  # type: ignore
        
        first_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        while success:
            success, image = vidcap.read()
            newframe = image
            logging.info(f"Read frames read: {count}")
            if count > 1 and success:
                # Convert current frame to grayscale (needed for structural similarity check)
                new_gray = cv2.cvtColor(newframe, cv2.COLOR_BGR2GRAY)
                # Structural similarity test.
                score: np.float64 = structural_similarity(first_gray, new_gray, full=False)  # type: ignore
                logging.info(f"Similarity Score: {score*100:.3f}%")
                if score * 100 < SIMILARITY_LIMIT:
                    kp1, des1 = sift.detectAndCompute(first_gray,None)
                    kp2, des2 = sift.detectAndCompute(new_gray,None)
                    index_params = dict(algorithm = FLANN_INDEX_KDTREE, trees = 5)
                    search_params = dict(checks = 50)
                    flann = cv2.FlannBasedMatcher(index_params, search_params)
                    matches = []
                    if(des1 is not None and len(des1)>2 and des2 is not None and len(des2)>2):
                        matches = flann.knnMatch(des1,des2,k=2)
                    good = []
                    for m,n in matches:
                        if m.distance < 0.7*n.distance:
                            good.append(m)
                    if len(good)<MIN_MATCH_COUNT:
                        analyze_count += 1
                        frame_id = getSetDB.set_selected_frame(analyze_count, video_id, count, 1, base64.b64encode(image).decode('utf-8'))
                        yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB), frame_id)  # type: ignore
                        first_gray = new_gray
                    elif len(good) > OVERWRIGHT_LIMIT:
                        first_gray = new_gray
                    good = []
            count += FRAME_SKIP
            # Skip ahead 30 frames from current frame
            vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )
        getSetDB.set_video_homogeny_runtime(video_id, run_time)
        return


def traditional_selector(vid, video_id):
    vidcap = cv2.VideoCapture(vid)
    if not vidcap.isOpened():
        logging.error("Video broken")
        return
    while True:
        success, image = vidcap.read()
        if success:
            break

    start_time = time.time()
    count = 1
    analyze_count = 1
    frame_id = getSetDB.set_selected_frame(analyze_count, video_id, count, 1, base64.b64encode(image).decode('utf-8'))
    yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB), frame_id)  # type: ignore
    
    # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
    while success:
        success, image = vidcap.read()
        newframe = image
        logging.info(f"Read frames read: {count}")
        if count > 1 and success:
            analyze_count += 1
            frame_id = getSetDB.set_selected_frame(analyze_count, video_id, count, 1, base64.b64encode(image).decode('utf-8'))
            yield SelectedFrame(count, cv2.cvtColor(newframe, cv2.COLOR_BGR2RGB), frame_id)   # type: ignore
        count += 1

    end_time = time.time()
    run_time = end_time - start_time
    logging.info(
        f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
    )
    return



@dataclass
class SelectedFrame:
    "The metadata of a selected frame."
    frame_number: int | None
    image: NDArray[np.uint8]
    frame_id: int



class FrameResponse(TypedDict):
    selector : str
    frames : list[SelectedFrame]

class FrameResponseFile(TypedDict):
    selector : str
    frames : list[SelectedFrame]
    run_time : float

class FrameSelector(ABC):
    "Interface for frame selectors."

    @abstractmethod
    def select_frames(self, video: FileStorage) -> List[SelectedFrame]:
        "Returns the list of frames selected from the video."


class StructuralSimilaritySelector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."


    def select_frames(self, video: FileStorage, selectors: List[str], video_id: int) -> List[FrameResponse]:
        "Selects frames from a video, using structural similarity to ignore similar frames."
        response = []
        with tempfile.NamedTemporaryFile() as rf:
            with tempfile.NamedTemporaryFile() as tf:
                tf.write(video.read())
                logging.info(tf.name)
                vid_resize(tf.name, rf.name, 480)
                logging.info(rf)
                for selector in selectors:
                    start = time.time()
                    # frames = list(self.__generate_frames(rf.name, selector))
                    end = time.time()
                    response.append(
                        FrameResponse({
                            "selector": selector, 
                            "frames": list(
                            self.__generate_frames(rf.name, selector, video_id)),
                            "run_time": end - start
                            }))
        return response

    def __generate_frames(self, video, selector, video_id) -> Iterator[SelectedFrame]:
            # Loads the video in to opencvs capture
            if selector == 'Structural Similarity':
                return ssim_selector(video, video_id)
            elif selector == 'Structural Similarity + Homogeny':
                return ssim_homogeny_selector(video, video_id)
            elif selector == 'Frame by Frame':
                return traditional_selector(video, video_id)
            else:
                raise ValueError("No frames selected.")
        


class YoutubeSelector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."

   
    

    # def select_frames(self, video, selector, video_id) -> List[SelectedFrame]:
    #     "Selects frames from a video, using structural similarity to ignore similar frames."
    #     return list(self.__generate_frames(video, selector, video_id))
    def select_frames(self, video, selectors, video_id) -> List[SelectedFrame]:
        "Selects frames from a video, using structural similarity to ignore similar frames."
        response = []
        for selector in selectors:
            start = time.time()
            frames = list(self.__generate_frames(video, selector, video_id))
            end = time.time()
            response.append(FrameResponseFile({
                "selector" :selector, 
                "frames" : frames,
                "run_time" : end - start
                }))
        # with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        #     start = time.time()
        #     frame_selections = {executor.submit(self.__generate_frames, video, selector): selector for selector in selectors}
        #     for future in concurrent.futures.as_completed(frame_selections):
        #         try:
        #             response.append(FrameResponseFile({
        #                 "selector" :frame_selections[future], 
        #                 "frames" : list(future.result()),
        #                 "run_time" : time.time() - start
        #             }))
        #         except Exception as e:
        #             logging.error(f"Error: {e} for ")
           
        return response

    def __generate_frames(self, video, selector, video_id):
        # Loads the video in to opencvs capture
        if selector == 'Structural Similarity':
            return ssim_selector(video.url, video_id)
        elif selector == 'Structural Similarity + Homogeny':
            return ssim_homogeny_selector(video.url, video_id)
        elif selector == 'Frame by Frame':
            return traditional_selector(video.url, video_id)
        else:
            raise ValueError("No frames selected.")
    

class TiktokSelector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."
   

    def select_frames(self, video, selectors, video_id) -> List[FrameResponse]:
        response = []
        with tempfile.TemporaryDirectory() as tf:
            ydl_opts = {
                    "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                    "merge_output_format": "mp4",
                    'outtmpl': f"{tf}/%(title).50s-%(id)s.%(ext)s",
            
            }
            with YoutubeDL(ydl_opts) as ydl:
                meta = ydl.extract_info(video, download=True)
            
            print(meta['requested_downloads'][0]['filepath'], file=sys.stderr)
            for selector in selectors:
                start = time.time()
                frames = list(self.__generate_frames(f"{meta['requested_downloads'][0]['filepath']}", selector, video_id))
                end = time.time()
                response.append(
                    FrameResponse({
                        "selector" :selector, 
                        "frames" : frames,
                        "run_time" : end - start
                        }))
        "Selects frames from a video, using structural similarity to ignore similar frames."
        return response

    def __generate_frames(self, video, selector, video_id) -> Iterator[SelectedFrame]:
        
            # Loads the video in to opencvs capture
            if selector == 'Structural Similarity':
                return ssim_selector(video, video_id)
            elif selector == 'Structural Similarity + Homogeny':
                return ssim_homogeny_selector(video, video_id)
            elif selector == 'Frame by Frame':
                return traditional_selector(video, video_id)
            else:
                raise ValueError("No frames selected.")
            # print(meta['requested_downloads'], file=sys.stderr)
            # Loads the video in to opencvs capture
            
    
class VimeoSelector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."


    # def select_frames(self, video, selector, video_id) -> List[SelectedFrame]:
    #     "Selects frames from a video, using structural similarity to ignore similar frames."
    #     return list(self.__generate_frames(video, selector, video_id))
    def select_frames(self, video, selectors) -> List[SelectedFrame]:
        "Selects frames from a video, using structural similarity to ignore similar frames."
        response = []
        for selector in selectors:
            start = time.time()
            frames = list(self.__generate_frames(video, selector, video_id))
            end = time.time()
            response.append(FrameResponseFile({
                "selector" :selector, 
                "frames" : frames,
                "run_time" : end - start
                }))
        return response

    def get_fps(self, video):
        vidcap = cv2.VideoCapture(video.direct_url)
        if not vidcap.isOpened:
            logging.error("Video broken")
            return
        fps = vidcap.get(cv2.CAP_PROP_FPS)
        vidcap.release()
        return fps

    def __generate_frames(self, video, selector, video_id):
        if selector == 'Structural Similarity':
            return ssim_selector(video.direct_url, video_id)
        elif selector == 'Structural Similarity + Homogeny':
            return ssim_homogeny_selector(video.direct_url, video_id)
        elif selector == 'Frame by Frame':
            return traditional_selector(video.direct_url, video_id)
        else:
            raise ValueError("No frames selected.")
        


class LiveSelector:
    "Like StructuralSimilaritySelector, but for streaming data."

    # Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
    FRAME_SKIP = 30
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT_LIVE = 65

    def __init__(self) -> None:
        super().__init__()
        self.most_recent_frame = None

    def select_frames(self, video: list[str] | FileStorage):
        "select_frames() but for streaming data."
        assert isinstance(video, list)
        return list(self.__generate_frames(video))

    def __generate_frames(self, frame_list: list[str]):
        im = base64.b64decode(frame_list[0].split(",")[1])
        image = np.array(Image.open(BytesIO(im)))
        start_time = time.time()
        count = 1
        analyze_count = 0
        new_gray = cv2.cvtColor(cv2.resize(image, (300, 300)), cv2.COLOR_BGR2GRAY)

        # If there is a previous frame, test it to the current frame
        if self.most_recent_frame is not None:
            first_gray = cv2.cvtColor(
                cv2.resize(self.most_recent_frame, (300, 300)), cv2.COLOR_BGR2GRAY
            )
            # Structural similarity test.
            score = structural_similarity(first_gray, new_gray, full=False)  # type: ignore
            logging.info(f"Similarity Score: {score*100:.3f}%")
            if score * 100 < self.SIMILARITY_LIMIT_LIVE:
                yield image
                first_gray = new_gray
                analyze_count = 1
                self.most_recent_frame = image
        else:
            yield image
            analyze_count = 1
            self.most_recent_frame = image
            first_gray = new_gray

        # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        for _ in range(1, len(frame_list)):
            image = np.array(
                Image.open(BytesIO(base64.b64decode(frame_list[count].split(",")[1])))
            )
            newframe = image
            logging.info(f"Read frames read: {count}")
            if count > 1:
                # Convert current frame to grayscale (needed for structural similarity check)
                new_gray = cv2.cvtColor(
                    cv2.resize(newframe, (300, 300)), cv2.COLOR_BGR2GRAY
                )
                # Structural similarity test.
                score = structural_similarity(first_gray, new_gray, full=False)  # type: ignore
                logging.info(f"Similarity Score: {score*100:.3f}%")
                if score * 100 < self.SIMILARITY_LIMIT_LIVE:
                    yield image
                    analyze_count += 1
                    first_gray = new_gray
            count += 1

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )

    def select_frames_homogeny(self, video: list[str] | FileStorage):
        assert isinstance(video, list)
        return list(self.__generate_frames_homogeny(video))

    def __generate_frames_homogeny(self, frame_list: list[str]):
        im = base64.b64decode(frame_list[0].split(",")[1])
        image = np.array(Image.open(BytesIO(im)))
        start_time = time.time()
        count = 1
        analyze_count = 0
        new_gray = cv2.cvtColor(cv2.resize(image, (300, 300)), cv2.COLOR_BGR2GRAY)
        sift = cv2.SIFT_create()
        # If there is a previous frame, test it to the current frame
        if self.most_recent_frame is not None:
            first_gray = cv2.cvtColor(
                cv2.resize(self.most_recent_frame, (300, 300)), cv2.COLOR_BGR2GRAY
            )
            # Structural similarity test.
            score = structural_similarity(first_gray, new_gray, full=False)  # type: ignore
            logging.info(f"Similarity Score: {score*100:.3f}%")
            if score * 100 < self.SIMILARITY_LIMIT_LIVE:
                yield image
                first_gray = new_gray
                analyze_count = 1
                self.most_recent_frame = image
        else:
            yield image
            analyze_count = 1
            self.most_recent_frame = image
            first_gray = new_gray

        # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        for _ in range(1, len(frame_list)):
            image = np.array(
                Image.open(BytesIO(base64.b64decode(frame_list[count].split(",")[1])))
            )
            newframe = image
            logging.info(f"Read frames read: {count}")
            
            if count > 1:
                # Convert current frame to grayscale (needed for structural similarity check)
                new_gray = cv2.cvtColor(
                    cv2.resize(newframe, (300, 300)), cv2.COLOR_BGR2GRAY
                )
                # Structural similarity test.
                score = structural_similarity(first_gray, new_gray, full=False)  # type: ignore
                logging.info(f"Similarity Score: {score*100:.3f}%")
                if score * 100 < self.SIMILARITY_LIMIT_LIVE:
                    kp1, des1 = sift.detectAndCompute(first_gray,None)
                    kp2, des2 = sift.detectAndCompute(new_gray,None)
                    index_params = dict(algorithm = FLANN_INDEX_KDTREE, trees = 5)
                    search_params = dict(checks = 50)
                    flann = cv2.FlannBasedMatcher(index_params, search_params)
                    matches = flann.knnMatch(des1,des2,k=2)
                    good = []
                    for m,n in matches:
                        if m.distance < 0.7*n.distance:
                            good.append(m)
                    if len(good)<MIN_MATCH_COUNT:
                        yield image
                        analyze_count += 1
                        first_gray = new_gray
                    elif len(good) > OVERWRIGHT_LIMIT:
                        first_gray = new_gray
                    good = []
            count += 1

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )
    
    def select_frames_traditional(self, video: list[str] | FileStorage) :
        "select_frames() but for streaming data."
        assert isinstance(video, list)
        return list(self.__generate_frames_traditional(video))

    def __generate_frames_traditional(self, frame_list: list[str]) :
        im = base64.b64decode(frame_list[0].split(",")[1])
        image = np.array(Image.open(BytesIO(im)))
        start_time = time.time()
        count = 1
        analyze_count = 0
        yield image
        analyze_count = 1
        self.most_recent_frame = image

        # If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
        for _ in range(1, len(frame_list)):
            image = np.array(
                Image.open(BytesIO(base64.b64decode(frame_list[count].split(",")[1])))
            )
            logging.info(f"Read frames read: {count}")
            if count > 1:
                yield image
                analyze_count += 1
            count += 1

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )