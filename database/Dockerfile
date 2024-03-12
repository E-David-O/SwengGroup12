FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install python3 python3-pip -y
RUN pip3 install --upgrade pip
WORKDIR /app

RUN pip install psycopg2-binary

COPY ./setup_db.py /app

CMD python3 setup_db.py