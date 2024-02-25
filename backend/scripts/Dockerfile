FROM ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install python3 python3-pip -y
RUN pip3 install --upgrade pip
RUN apt-get install libsm6 libxext6  -y
RUN apt-get install -y python3-opencv
WORKDIR /app
RUN pip install ffmpeg-python && pip install psycopg2-binary && pip install scikit-image && pip install opencv-python
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
CMD ["celery", "-A", "app.celery", "worker", "-l", "INFO"]
