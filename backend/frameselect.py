# import cv2
# from skimage.metrics import structural_similarity
# import os
# import sys
# import time
# import base64
# import tempfile
# import json
# from app import celery
# FRAME_SKIP = 30                                     #Check every 30th frame in this case since the video is at 60 fps we sample every 0.5 seconds
# SIMILARITY_LIMIT = 50                               #The treshold of similarity if two images are less than this% in similarity the new frame i sent to be analyzed
# VIDEO_TO_BREAKDOWN = 'TCD_short.mp4'                #The source video

# def convert_frame_to_bin(frame):
#     _, imdata = cv2.imencode('.JPG',frame)
#     jstr = json.dumps({"image": base64.b64encode(imdata).decode('ascii')})
#     return jstr

# # def rescale_frame(frame, percent=20):
# #     width = int(frame.shape[1] * percent / 100)
# #     height = int(frame.shape[0] * percent / 100)
# #     dim = (width, height)
# #     return cv2.resize(frame, dim, interpolation=cv2.INTER_AREA)

# def select_frames(video):
#     # empty temp file
#     print(video, file=sys.stderr)
#     tf = tempfile.NamedTemporaryFile()
#     # video contents
#     out = video
#     # add video contents to empty file
#     tf.write(out.read())
    
#     analyze_count = 0
#     vidcap = cv2.VideoCapture(tf.name)       #Loads the video in to opencvs capture
#     if not vidcap.isOpened:
#         print('Video broken', file=sys.stderr)
#     while True:
#         success,image = vidcap.read()
#         if image is None:
#             print('Image broken', file=sys.stderr)

#         if success == True:
#             break

       
#     start_time = time.time()
#     count = 1
#     celery.send_task("celery_tasks.analyze_task", (convert_frame_to_bin(image)))
#     #cv2.imwrite(os.path.join(path , 'analyze_frame%d.jpg' % analyze_count), image) #The very first frame is saved since it will be our first frame to be analyzed
#     analyze_count += 1
#     first_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     while success:                                                                 #If the re is a  next frame (30 frames after the last one) test it to the previously analyzed frame
#         success,image = vidcap.read()
#         newframe = image
#         print('Read frames read: ', count)
#         if count > 1 and newframe is not None:
#             new_gray = cv2.cvtColor(newframe, cv2.COLOR_BGR2GRAY)                  #Convert current frame to grayscale (needed for structural similarity check)
#             score = structural_similarity(first_gray, new_gray, full=False)        #Structural similarity test.
#             print("Similarity Score: {:.3f}%".format(score * 100))
#             if score * 100 < SIMILARITY_LIMIT:
#                 celery.send_task("celery_tasks.analyze_task", (convert_frame_to_bin(newframe)))
#                 #cv2.imwrite(os.path.join(path , 'analyze_frame%d.jpg' % analyze_count), newframe)   #If its below the treshhold send new frame to analysis
#                 analyze_count += 1
#                 first_gray = new_gray
#         count += FRAME_SKIP                                                        
#         vidcap.set(cv2.CAP_PROP_POS_FRAMES, count)                                  #Skip ahead 30 frames from current frame

#     tf.close()
#     end_time = time.time()
#     run_time = end_time - start_time
#     print("Out of the %(frames)d images %(analyzed)d where sent for further analysis. \nTotal time: %(time)ds" % {"frames": count, "analyzed" :analyze_count, "time": run_time})




