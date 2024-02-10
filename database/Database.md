# Databases
## Frame Metadata
### What do the columns mean
- id: the id of the individual object detected from the frame
- id_user: the user id of the frame, for later when we have authentication, default value is temp. Default value is placeholder
- date_and_time: date and time the frame was analyzed. Default value is placeholder
- _object: object detected from the frame analysis. Default value is placeholder
- confidence: the confidence of the analyzer on the detected object. Default value is 0
- image_id: the id of the image which was sent through, as an image can have multiple objects detected in it. Default value is 0

