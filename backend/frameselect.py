import cv2
from skimage.metrics import structural_similarity
import os
import time

start_time = time.time()
path = 'C:/Users/David/Desktop/Trinity/Sweng2024/Test/analyzeImages'
vidcap = cv2.VideoCapture('TCD_short.mp4')
success,image = vidcap.read()
analyze_count = 1
count = 1
template = image
cv2.imwrite(os.path.join(path , 'analyze_frame%d.jpg' % analyze_count), image)
analyze_count += 1
first_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
while success: 
    success,image = vidcap.read()
    newframe = image
    print('Read frames read: ', count)
    if count > 1 and newframe is not None:
        new_gray = cv2.cvtColor(newframe, cv2.COLOR_BGR2GRAY)
        score = structural_similarity(first_gray, new_gray, full=False)
        print("Similarity Score: {:.3f}%".format(score * 100))
        if score * 100 < 65:
            cv2.imwrite(os.path.join(path , 'analyze_frame%d.jpg' % analyze_count), newframe)
            analyze_count += 1
            first_gray = new_gray
    count += 30
    vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)

end_time = time.time()
run_time = end_time - start_time
print("Out of the %(frames)d images %(analyzed)d where sent for further analysis. \nTotal time: %(time)ds" % {"frames": count, "analyzed" :analyze_count-1, "time": run_time})
