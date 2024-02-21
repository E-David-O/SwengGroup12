from ultralytics import YOLO
frame = "FrameAnanlysis\\testImg.jpeg"
model = YOLO('yolov8n.pt')

def frameAnalysis(frame):
    results = model(source= frame, show = False, conf = 0.4, save = True)
    print(results)


    # View results
    for r in results:
        print(r.boxes)  # print the Boxes object containing the detection bounding boxes


frameAnalysis(frame)