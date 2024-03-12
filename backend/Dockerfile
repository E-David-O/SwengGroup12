# syntax=docker/dockerfile:1
FROM ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y python3 python3-pip libsm6 libxext6 python3-opencv
RUN pip3 install --upgrade pip
RUN apt-get install -y --no-install-recommends ffmpeg
WORKDIR /app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_APP=app.py
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]