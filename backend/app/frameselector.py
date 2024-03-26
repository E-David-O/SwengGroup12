"Classes to select frames from a video."

import base64
import logging
import os
import tempfile
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from io import BytesIO
from typing import Iterator, List

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


@dataclass
class SelectedFrame:
    "The metadata of a selected frame."
    frame_number: int | None
    image: NDArray[np.uint8]
    frame_id: int = 0


class FrameSelector(ABC):
    "Interface for frame selectors."

    @abstractmethod
    def select_frames(self, video: FileStorage) -> List[SelectedFrame]:
        "Returns the list of frames selected from the video."


class StructuralSimilaritySelector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."

    # Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
    FRAME_SKIP = 30
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT = 70
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT_LIVE = 40

    def select_frames(self, video: FileStorage, video_id) -> List[SelectedFrame]:
        "Selects frames from a video, using structural similarity to ignore similar frames."
        return list(self.__generate_frames(video, video_id))
        return list(self.__generate_frames(video, video_id))

    def __generate_frames(self, video: FileStorage, video_id) -> Iterator[SelectedFrame]:
        with tempfile.NamedTemporaryFile() as rf:
            with tempfile.NamedTemporaryFile() as tf:
                tf.write(video.read())
                logging.info(tf.name)
                vid_resize(tf.name, rf.name, 720)
                logging.info(rf)

            # Loads the video in to opencvs capture
            vidcap = cv2.VideoCapture(rf.name)
            if not vidcap.isOpened():
                logging.error("Video broken")
                return
            while True:
                success, image = vidcap.read()
                if success:
                    break

            start_time = time.time()
            count = 1
            frame_id = getSetDB.set_selected_frame(None, video_id, count, 0, "")
            yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB), frame_id)  # type: ignore
            analyze_count = 1
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
                    if score * 100 < self.SIMILARITY_LIMIT:
                        frame_id = getSetDB.set_selected_frame(None, video_id, count, 0, "")
                        yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB), frame_id)   # type: ignore
                        analyze_count += 1
                        first_gray = new_gray
                count += self.FRAME_SKIP
                # Skip ahead 30 frames from current frame
                vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )
        return


class SSIM_Homogeny_Selector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."

    # Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
    FRAME_SKIP = 30
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT = 70
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT_LIVE = 40

    def select_frames(self, video: FileStorage) -> List[SelectedFrame]:
        "Selects frames from a video, using structural similarity to ignore similar frames."
        return list(self.__generate_frames(video))

    def __generate_frames(self, video):
        # Flann index
        FLANN_INDEX_KDTREE = 1
        # Minimum number of good feature point matches to comnclude identical object in the two image
        MIN_MATCH_COUNT = 40
        #If we find more good identical feature points than this we set this frame as the new reference to help filter selection.
        OVERWRIGHT_LIMIT = 100
        sift = cv2.SIFT_create()
        with tempfile.NamedTemporaryFile() as rf:
            with tempfile.NamedTemporaryFile() as tf:
                tf.write(video.read())
                logging.info(tf.name)
                vid_resize(tf.name, rf.name, 720)
                logging.info(rf)

            # Loads the video in to opencvs capture
            vidcap = cv2.VideoCapture(rf.name)
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
            yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB))  # type: ignore
            analyze_count = 1
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
                    if score * 100 < self.SIMILARITY_LIMIT:
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
                            yield SelectedFrame(count, cv2.cvtColor(newframe, cv2.COLOR_BGR2RGB))
                            analyze_count += 1
                            first_gray = new_gray
                        elif len(good) > OVERWRIGHT_LIMIT:
                            first_gray = new_gray
                        good = []
                count += self.FRAME_SKIP
                # Skip ahead 30 frames from current frame
                vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )
        return

class LiveSelector(FrameSelector):
    "Like StructuralSimilaritySelector, but for streaming data."

    # Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
    FRAME_SKIP = 30
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT = 80
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT_LIVE = 65

    def __init__(self) -> None:
        super().__init__()
        self.most_recent_frame = None

    def select_frames(self, video: list[str] | FileStorage) -> List[SelectedFrame]:
        "select_frames() but for streaming data."
        assert isinstance(video, list)
        return list(self.__generate_frames(video))

    def __generate_frames(self, frame_list: list[str]) -> Iterator[SelectedFrame]:
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
                yield SelectedFrame(None, image)
                first_gray = new_gray
                analyze_count = 1
                self.most_recent_frame = image
        else:
            yield SelectedFrame(None, image)
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
                    yield SelectedFrame(None, image)
                    analyze_count += 1
                    first_gray = new_gray
            count += 1

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )

class YoutubeSelector(FrameSelector):
    "Uses OpenCV structural similarity to skip similar frames."

    # Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
    FRAME_SKIP = 30
    # The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
    SIMILARITY_LIMIT = 80
    

    def select_frames(self, video) -> List[SelectedFrame]:
        "Selects frames from a video, using structural similarity to ignore similar frames."
        return list(self.__generate_frames(video))

    def __generate_frames(self, video):
        vidcap = cv2.VideoCapture(video.url)
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
        yield SelectedFrame(count, cv2.cvtColor(image, cv2.COLOR_BGR2RGB)) 
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
                if score * 100 < self.SIMILARITY_LIMIT:
                    yield SelectedFrame(count, cv2.cvtColor(newframe, cv2.COLOR_BGR2RGB)) 
                    analyze_count += 1
                    first_gray = new_gray
            count += self.FRAME_SKIP
            # Skip ahead 30 frames from current frame
            vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

        end_time = time.time()
        run_time = end_time - start_time
        logging.info(
            f"Out of the {count} images, {analyze_count} were sent for further analysis.\nTotal time: {run_time}s"
        )
        return
    

    
