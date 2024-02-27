from ultralytics import YOLO
frame = "FrameAnanlysis\\testImg.jpeg"
model = YOLO('yolov8n.pt')

def frameAnalysis(frame):
    results = model(source= frame, show = False, conf = 0.4, save = True)


    # View results
    for r in results:
        print(r.keypoints)
frameAnalysis(frame)