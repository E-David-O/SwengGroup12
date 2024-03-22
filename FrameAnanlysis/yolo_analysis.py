from ultralytics import YOLO
frame = "FrameAnanlysis\\testImg.jpeg"
model = YOLO('yolov8n.pt')

def frameAnalysis(frame):
    results = model(source= frame, show = False, conf = 0.4, save = True, save_txt	= True, show_labels = True)
    # print(results)
    for result in results:
        if(result):
            boxes = result[0].boxes.numpy()  # Boxes object for bbox outputs
            for box in boxes:  # there could be more than one detection
                print("class", box.cls)
                print("xyxy", box.xyxy)
                print("conf", box.conf)
frameAnalysis(frame)