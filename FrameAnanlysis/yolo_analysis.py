from ultralytics import YOLO

model = YOLO('yolov8n.pt')

results = model(source="FrameAnanlysis\\test01.mp4", show = True, conf = 0.4, save = True)