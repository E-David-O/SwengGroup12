#run pip install ultralytics
from ultralytics import YOLO

model = YOLO('yolov8n.pt')

def frameAnalysis(source):
    results = model(source=source, save=True)

frameAnalysis('TCD_short.mp4')

