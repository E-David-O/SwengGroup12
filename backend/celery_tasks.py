from app import celery
import json
import base64

@celery.task
def analyze_task(frame):
    load = json.loads(frame)
    imdata = base64.b64decode(load['image'])
    print(imdata)

